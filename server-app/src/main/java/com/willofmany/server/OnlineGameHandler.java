package com.willofmany.server;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class OnlineGameHandler extends TextWebSocketHandler {
    private static final Logger logger = LoggerFactory.getLogger(OnlineGameHandler.class);
    private static final Duration DEFAULT_INACTIVITY_TIMEOUT = Duration.ofSeconds(40);
    private final MatchmakingService matchmaking;
    private final MatchResultService results;
    private final ObjectMapper mapper;
    private final ScheduledExecutorService timeoutScheduler;
    private final Duration inactivityTimeout;
    private final Map<String, ScheduledFuture<?>> inactivityTasks = new ConcurrentHashMap<>();

    public OnlineGameHandler(
        MatchmakingService matchmaking,
        MatchResultService results,
        ObjectMapper mapper
    ) {
        this(matchmaking, results, mapper, DEFAULT_INACTIVITY_TIMEOUT);
    }

    OnlineGameHandler(
        MatchmakingService matchmaking,
        MatchResultService results,
        ObjectMapper mapper,
        Duration inactivityTimeout
    ) {
        this.matchmaking = matchmaking;
        this.results = results;
        this.mapper = mapper;
        this.inactivityTimeout = inactivityTimeout;
        timeoutScheduler = Executors.newSingleThreadScheduledExecutor(task -> {
            Thread thread = new Thread(task, "online-match-inactivity-timeout");
            thread.setDaemon(true);
            return thread;
        });
    }

    @PreDestroy
    public void shutdownTimeoutScheduler() {
        timeoutScheduler.shutdownNow();
        inactivityTasks.clear();
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        OnlineMatch match = match(session);
        long playerId = playerId(session);
        match.getSessions().put(playerId, session);
        JsonNode currentState = match.getGameState();
        send(session, Map.of(
            "type", "match_ready",
            "team", team(session),
            "matchId", match.getId(),
            "gameStarted", currentState != null
        ));
        if (currentState != null) send(session, Map.of("type", "game_start", "state", currentState));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        if (message.getPayloadLength() > 2_000_000) {
            reject(session, "Mensagem de partida muito grande.");
            return;
        }
        JsonNode payload;
        try {
            payload = mapper.readTree(message.getPayload());
        } catch (Exception exception) {
            reject(session, "Mensagem JSON inválida.");
            return;
        }
        OnlineMatch match = match(session);
        String type = payload.path("type").asText();
        switch (type) {
            case "game_start" -> handleGameStart(session, match, payload);
            case "game_action" -> handleGameAction(session, match, payload);
            case "game_state" -> handleGameState(session, match, payload);
            case "war_request" -> relay(match, playerId(session), payload);
            case "war_start" -> {
                if (!"orange".equals(team(session))) reject(session, "Somente a equipe laranja inicia a guerra online.");
                else relay(match, playerId(session), payload);
            }
            case "game_over" -> handleGameOver(session, match, payload);
            default -> reject(session, "Tipo de mensagem online desconhecido.");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        Object matchId = session.getAttributes().get("matchId");
        Object playerId = session.getAttributes().get("playerId");
        if (matchId instanceof String id && playerId instanceof Number number) {
            matchmaking.removeSession(id, number.longValue());
        }
    }

    private void handleGameStart(WebSocketSession session, OnlineMatch match, JsonNode payload) throws IOException {
        JsonNode state = payload.path("state");
        if (!"orange".equals(team(session)) || !validState(state) ||
            !"orange".equals(state.path("currentTeam").asText())) {
            reject(session, "Estado inicial da partida inválido.");
            return;
        }
        long activityRevision = match.setGameState(state);
        if (activityRevision < 0) return;
        scheduleInactivityTimeout(match, activityRevision);
        relay(match, playerId(session), payload);
    }

    private void handleGameAction(WebSocketSession session, OnlineMatch match, JsonNode payload) throws IOException {
        JsonNode action = payload.path("action");
        JsonNode state = payload.path("state");
        String playerTeam = team(session);
        if (!validState(state) ||
            !playerTeam.equals(action.path("team").asText()) ||
            !playerTeam.equals(match.getCurrentTeam()) ||
            !playerTeam.equals(state.path("currentTeam").asText()) ||
            state.path("currentTurn").asInt(-1) != match.getCurrentTurn()) {
            reject(session, "Ação fora da vez ou estado de partida inválido.");
            return;
        }
        long activityRevision = match.setGameState(state);
        if (activityRevision < 0) return;
        scheduleInactivityTimeout(match, activityRevision);
        relay(match, playerId(session), payload);
    }

    private void handleGameState(WebSocketSession session, OnlineMatch match, JsonNode payload) throws IOException {
        JsonNode state = payload.path("state");
        String nextTeam = opposite(team(session));
        if (!validState(state) ||
            !team(session).equals(match.getCurrentTeam()) ||
            !nextTeam.equals(state.path("currentTeam").asText()) ||
            state.path("currentTurn").asInt(-1) != match.getCurrentTurn() + 1) {
            reject(session, "Transição de turno inválida.");
            return;
        }
        long activityRevision = match.setGameState(state);
        if (activityRevision < 0) return;
        scheduleInactivityTimeout(match, activityRevision);
        relay(match, playerId(session), payload);
    }

    private void handleGameOver(WebSocketSession session, OnlineMatch match, JsonNode payload) throws IOException {
        String winner = payload.path("winner").asText();
        if (!"orange".equals(winner) && !"blue".equals(winner) && !"draw".equals(winner)) {
            reject(session, "Resultado final inválido.");
            return;
        }
        if (!match.tryComplete()) {
            reject(session, "O resultado desta partida já foi registrado.");
            return;
        }
        cancelInactivityTimeout(match);
        MatchResultService.Result updated = results.record(match, winner);
        Map<String, Object> completed = Map.of(
            "type", "game_over",
            "winner", winner,
            "reason", payload.path("reason").asText("turn30"),
            "victoryPoints", payload.path("victoryPoints"),
            "orange", updated.orange(),
            "blue", updated.blue()
        );
        match.setComplete();
        relay(match, playerId(session), mapper.valueToTree(completed));
        matchmaking.complete(match);
    }

    private void scheduleInactivityTimeout(OnlineMatch match, long activityRevision) {
        ScheduledFuture<?> nextTask = timeoutScheduler.schedule(
            () -> finishForInactivity(match, activityRevision),
            inactivityTimeout.toMillis(),
            TimeUnit.MILLISECONDS
        );
        ScheduledFuture<?> previousTask = inactivityTasks.put(match.getId(), nextTask);
        if (previousTask != null) previousTask.cancel(false);
    }

    private void cancelInactivityTimeout(OnlineMatch match) {
        ScheduledFuture<?> timeoutTask = inactivityTasks.remove(match.getId());
        if (timeoutTask != null) timeoutTask.cancel(false);
    }

    private void finishForInactivity(OnlineMatch match, long activityRevision) {
        String inactiveTeam = match.tryForfeitIfInactive(activityRevision);
        if (inactiveTeam == null) return;
        cancelInactivityTimeout(match);

        String winner = opposite(inactiveTeam);
        try {
            MatchResultService.Result updated = results.record(match, winner);
            Map<String, Object> completed = new HashMap<>();
            completed.put("type", "game_over");
            completed.put("winner", winner);
            completed.put("reason", "inactivity");
            completed.put("inactiveTeam", inactiveTeam);
            completed.put("victoryPoints", match.getGameState().path("victoryPoints"));
            completed.put("orange", updated.orange());
            completed.put("blue", updated.blue());
            matchmaking.complete(match);
            broadcast(match, mapper.valueToTree(completed));
        } catch (RuntimeException | IOException exception) {
            logger.error("Could not complete inactive online match {}", match.getId(), exception);
        }
    }

    private void relay(OnlineMatch match, long senderId, JsonNode message) throws IOException {
        for (Map.Entry<Long, WebSocketSession> entry : match.getSessions().entrySet()) {
            if (entry.getKey() != senderId && entry.getValue().isOpen()) {
                entry.getValue().sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            }
        }
    }

    private void broadcast(OnlineMatch match, JsonNode message) throws IOException {
        String serialized = mapper.writeValueAsString(message);
        for (Map.Entry<Long, WebSocketSession> entry : match.getSessions().entrySet()) {
            try {
                if (entry.getValue().isOpen()) {
                    entry.getValue().sendMessage(new TextMessage(serialized));
                }
            } catch (IOException exception) {
                logger.warn(
                    "Could not notify player {} about inactivity result for match {}",
                    entry.getKey(),
                    match.getId(),
                    exception
                );
            }
        }
    }

    private void send(WebSocketSession session, Object message) throws IOException {
        if (session.isOpen()) session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
    }

    private void reject(WebSocketSession session, String message) throws IOException {
        send(session, Map.of("type", "error", "message", message));
    }

    private boolean validState(JsonNode state) {
        return state != null && state.isObject() &&
            state.path("regionPiecesByRegion").isObject() &&
            ("orange".equals(state.path("currentTeam").asText()) ||
                "blue".equals(state.path("currentTeam").asText()));
    }

    private OnlineMatch match(WebSocketSession session) {
        return matchmaking.requireMatch(
            String.valueOf(session.getAttributes().get("matchId")),
            playerId(session)
        );
    }

    private long playerId(WebSocketSession session) {
        Object value = session.getAttributes().get("playerId");
        if (value instanceof Number number) return number.longValue();
        throw new ApiException(HttpStatus.UNAUTHORIZED, "Sessão online inválida.");
    }

    private String team(WebSocketSession session) {
        return String.valueOf(session.getAttributes().get("team"));
    }

    private String opposite(String team) {
        return "orange".equals(team) ? "blue" : "orange";
    }
}
