package com.willofmany.server;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

class OnlineGameHandlerTest {
    private final MatchmakingService matchmaking = mock(MatchmakingService.class);
    private final MatchResultService results = mock(MatchResultService.class);
    private final ObjectMapper mapper = new ObjectMapper();
    private final OnlineGameHandler handler = new OnlineGameHandler(matchmaking, results, mapper);
    private final OnlineMatch match = new OnlineMatch(
        "match-id",
        new PlayerView(1L, "orange@example.com", "Orange", 1200),
        new PlayerView(2L, "blue@example.com", "Blue", 1200)
    );

    @Test
    void announcesThatNewMatchNeedsHostToStart() throws Exception {
        JsonNode ready = establishConnection(null);

        assertEquals("match_ready", ready.path("type").asText());
        assertEquals("orange", ready.path("team").asText());
        assertEquals("match-id", ready.path("matchId").asText());
        assertEquals(false, ready.path("gameStarted").asBoolean());
    }

    @Test
    void announcesWhenMatchAlreadyHasGameState() throws Exception {
        JsonNode state = mapper.readTree("""
            {"currentTeam":"blue","regionPiecesByRegion":{}}
            """);
        JsonNode ready = establishConnection(state);

        assertEquals(true, ready.path("gameStarted").asBoolean());
    }

    @Test
    void awardsVictoryToOpponentWhenPlayerAbandonsStartedMatch() throws Exception {
        JsonNode state = mapper.readTree("""
            {
              "currentTeam": "orange",
              "currentTurn": 1,
              "regionPiecesByRegion": {},
              "victoryPoints": {"orange": 0, "blue": 0}
            }
            """);
        match.setGameState(state);
        WebSocketSession orangeSession = session(1L, "orange");
        WebSocketSession blueSession = session(2L, "blue");
        CountDownLatch gameOverSent = new CountDownLatch(2);
        doAnswer(invocation -> {
            TextMessage message = invocation.getArgument(0);
            if (message.getPayload().contains("\"reason\":\"surrender\"")) gameOverSent.countDown();
            return null;
        }).when(orangeSession).sendMessage(org.mockito.ArgumentMatchers.any(TextMessage.class));
        doAnswer(invocation -> {
            TextMessage message = invocation.getArgument(0);
            if (message.getPayload().contains("\"reason\":\"surrender\"")) gameOverSent.countDown();
            return null;
        }).when(blueSession).sendMessage(org.mockito.ArgumentMatchers.any(TextMessage.class));

        when(matchmaking.requireMatch("timed-match", 1L)).thenReturn(match);
        when(matchmaking.requireMatch("timed-match", 2L)).thenReturn(match);
        when(results.record(match, "blue")).thenReturn(new MatchResultService.Result(
            new MatchResultService.RatingView("Orange", 1184),
            new MatchResultService.RatingView("Blue", 1216)
        ));
        handler.afterConnectionEstablished(orangeSession);
        handler.afterConnectionEstablished(blueSession);
        handler.handleTextMessage(orangeSession, new TextMessage("""
            {"type":"game_surrender"}
            """));

        assertTrue(gameOverSent.await(3, TimeUnit.SECONDS));
        ArgumentCaptor<TextMessage> sentMessages = ArgumentCaptor.forClass(TextMessage.class);
        verify(blueSession, times(3)).sendMessage(sentMessages.capture());
        JsonNode gameOver = sentMessages.getAllValues().stream()
            .map(message -> {
                try {
                    return mapper.readTree(message.getPayload());
                } catch (Exception exception) {
                    throw new IllegalStateException(exception);
                }
            })
            .filter(message -> "surrender".equals(message.path("reason").asText()))
            .findFirst()
            .orElseThrow();
        assertEquals("game_over", gameOver.path("type").asText());
        assertEquals("orange", gameOver.path("surrenderingTeam").asText());
        assertEquals("blue", gameOver.path("winner").asText());
        verify(results).record(match, "blue");
        verify(matchmaking).complete(match);
        assertTrue(match.isComplete());
    }

    @Test
    void rejectsAbandoningMatchBeforeItStarts() throws Exception {
        WebSocketSession orangeSession = session(1L, "orange");
        when(matchmaking.requireMatch("timed-match", 1L)).thenReturn(match);

        handler.handleTextMessage(orangeSession, new TextMessage("""
            {"type":"game_surrender"}
            """));

        ArgumentCaptor<TextMessage> sentMessage = ArgumentCaptor.forClass(TextMessage.class);
        verify(orangeSession).sendMessage(sentMessage.capture());
        JsonNode error = mapper.readTree(sentMessage.getValue().getPayload());
        assertEquals("error", error.path("type").asText());
        assertTrue(error.path("message").asText().contains("ainda não começou"));
        verify(results, never()).record(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.anyString());
        verify(matchmaking, never()).complete(match);
    }

    @Test
    void awardsWinToOpponentWhenCurrentPlayerIsInactive() throws Exception {
        OnlineMatch timedMatch = new OnlineMatch(
            "timed-match",
            new PlayerView(1L, "orange@example.com", "Orange", 1200),
            new PlayerView(2L, "blue@example.com", "Blue", 1200)
        );
        WebSocketSession orangeSession = session(1L, "orange");
        WebSocketSession blueSession = session(2L, "blue");
        CountDownLatch gameOverSent = new CountDownLatch(1);
        doAnswer(invocation -> {
            TextMessage message = invocation.getArgument(0);
            if (message.getPayload().contains("\"reason\":\"inactivity\"")) gameOverSent.countDown();
            return null;
        }).when(blueSession).sendMessage(org.mockito.ArgumentMatchers.any(TextMessage.class));

        when(matchmaking.requireMatch("timed-match", 1L)).thenReturn(timedMatch);
        when(matchmaking.requireMatch("timed-match", 2L)).thenReturn(timedMatch);
        when(results.record(timedMatch, "blue")).thenReturn(new MatchResultService.Result(
            new MatchResultService.RatingView("Orange", 1184),
            new MatchResultService.RatingView("Blue", 1216)
        ));
        OnlineGameHandler timedHandler = new OnlineGameHandler(
            matchmaking,
            results,
            mapper,
            Duration.ofMillis(100)
        );
        try {
            timedHandler.afterConnectionEstablished(orangeSession);
            timedHandler.afterConnectionEstablished(blueSession);
            JsonNode payload = mapper.readTree("""
                {
                  "type": "game_start",
                  "state": {
                    "currentTeam": "orange",
                    "currentTurn": 1,
                    "regionPiecesByRegion": {},
                    "victoryPoints": {"orange": 0, "blue": 0}
                  }
                }
                """);
            timedHandler.handleTextMessage(orangeSession, new TextMessage(mapper.writeValueAsString(payload)));

            assertTrue(gameOverSent.await(3, TimeUnit.SECONDS));
            ArgumentCaptor<TextMessage> sentMessage = ArgumentCaptor.forClass(TextMessage.class);
            verify(blueSession, org.mockito.Mockito.atLeastOnce()).sendMessage(sentMessage.capture());
            JsonNode gameOver = sentMessage.getAllValues().stream()
                .map(message -> {
                    try {
                        return mapper.readTree(message.getPayload());
                    } catch (Exception exception) {
                        throw new IllegalStateException(exception);
                    }
                })
                .filter(message -> "inactivity".equals(message.path("reason").asText()))
                .findFirst()
                .orElseThrow();
            assertEquals("game_over", gameOver.path("type").asText());
            assertEquals("orange", gameOver.path("inactiveTeam").asText());
            assertEquals("blue", gameOver.path("winner").asText());
            verify(results).record(timedMatch, "blue");
            verify(matchmaking).complete(timedMatch);
            assertTrue(timedMatch.isComplete());
        } finally {
            timedHandler.shutdownTimeoutScheduler();
        }
    }

    private JsonNode establishConnection(JsonNode gameState) throws Exception {
        WebSocketSession session = mock(WebSocketSession.class);
        when(session.getAttributes()).thenReturn(Map.of(
            "matchId", "match-id",
            "playerId", 1L,
            "team", "orange"
        ));
        when(session.isOpen()).thenReturn(true);
        when(matchmaking.requireMatch("match-id", 1L)).thenReturn(match);
        match.setGameState(gameState);

        handler.afterConnectionEstablished(session);

        ArgumentCaptor<TextMessage> message = ArgumentCaptor.forClass(TextMessage.class);
        verify(session, times(gameState == null ? 1 : 2)).sendMessage(message.capture());
        return mapper.readTree(message.getAllValues().get(0).getPayload());
    }

    private WebSocketSession session(long playerId, String team) {
        WebSocketSession session = mock(WebSocketSession.class);
        when(session.getAttributes()).thenReturn(Map.of(
            "matchId", "timed-match",
            "playerId", playerId,
            "team", team
        ));
        when(session.isOpen()).thenReturn(true);
        return session;
    }

    @Test
    void newPlayerInteractionInvalidatesAnOlderTimeout() throws Exception {
        OnlineMatch activeMatch = new OnlineMatch(
            "active-match",
            new PlayerView(1L, "orange@example.com", "Orange", 1200),
            new PlayerView(2L, "blue@example.com", "Blue", 1200)
        );
        JsonNode orangeTurn = mapper.readTree("""
            {"currentTeam":"orange","currentTurn":1,"regionPiecesByRegion":{}}
            """);
        JsonNode blueTurn = mapper.readTree("""
            {"currentTeam":"blue","currentTurn":1,"regionPiecesByRegion":{}}
            """);

        long expiredRevision = activeMatch.setGameState(orangeTurn);
        long activeRevision = activeMatch.setGameState(blueTurn);

        assertNull(activeMatch.tryForfeitIfInactive(expiredRevision));
        assertEquals("blue", activeMatch.tryForfeitIfInactive(activeRevision));
    }
}
