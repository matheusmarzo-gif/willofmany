package com.willofmany.server;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class MatchmakingService {
    private final Map<Long, QueueEntry> waiting = new HashMap<>();
    private final Map<Long, OnlineMatch> playerMatches = new HashMap<>();
    private final Map<String, OnlineMatch> matches = new HashMap<>();

    public synchronized MatchStatus join(Player player) {
        return join(PlayerView.from(player));
    }

    public synchronized MatchStatus join(PlayerView player) {
        OnlineMatch current = playerMatches.get(player.id());
        if (current != null && !current.isComplete()) {
            return statusFor(current, player.id());
        }
        waiting.remove(player.id());
        QueueEntry entry = new QueueEntry(player.id(), player, Instant.now());
        waiting.put(player.id(), entry);

        QueueEntry opponent = waiting.values().stream()
            .filter(candidate -> candidate.playerId() != player.id())
            .filter(candidate -> Math.abs(candidate.player().elo() - player.elo()) <= allowedEloDifference(candidate))
            .min(Comparator
                .comparingInt((QueueEntry candidate) -> Math.abs(candidate.player().elo() - player.elo()))
                .thenComparing(QueueEntry::joinedAt))
            .orElse(null);
        if (opponent != null) {
            waiting.remove(player.id());
            waiting.remove(opponent.playerId());
            PlayerView orange = opponent.player();
            PlayerView blue = entry.player();
            OnlineMatch match = new OnlineMatch(UUID.randomUUID().toString(), orange, blue);
            matches.put(match.getId(), match);
            playerMatches.put(orange.id(), match);
            playerMatches.put(blue.id(), match);
            return statusFor(match, player.id());
        }
        return waitingStatus(entry);
    }

    public synchronized MatchStatus status(long playerId) {
        OnlineMatch match = playerMatches.get(playerId);
        if (match != null && !match.isComplete()) return statusFor(match, playerId);
        QueueEntry entry = waiting.get(playerId);
        return entry == null ? new MatchStatus("idle", null, null, null, 0) : waitingStatus(entry);
    }

    public synchronized LobbyView lobby(long playerId) {
        List<LobbyPlayer> players = waiting.values().stream()
            .filter(entry -> entry.playerId() != playerId)
            .sorted(Comparator.comparing(QueueEntry::joinedAt))
            .map(entry -> new LobbyPlayer(
                entry.player().name(),
                entry.player().elo(),
                Math.max(0, Instant.now().getEpochSecond() - entry.joinedAt().getEpochSecond())
            ))
            .toList();
        return new LobbyView(players);
    }

    public synchronized void leaveQueue(long playerId) {
        if (playerMatches.containsKey(playerId)) {
            throw new ApiException(HttpStatus.CONFLICT, "Uma partida já foi encontrada; saia pelo jogo após concluí-la.");
        }
        waiting.remove(playerId);
    }

    public synchronized OnlineMatch requireMatch(String matchId, long playerId) {
        OnlineMatch match = matches.get(matchId);
        if (match == null || match.isComplete() || match.getTeam(playerId) == null) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Partida online não encontrada ou já encerrada.");
        }
        return match;
    }

    public synchronized void complete(OnlineMatch match) {
        match.setComplete();
        playerMatches.remove(match.getOrange().id());
        playerMatches.remove(match.getBlue().id());
        matches.remove(match.getId());
    }

    public synchronized void removeSession(String matchId, long playerId) {
        OnlineMatch match = matches.get(matchId);
        if (match != null) match.getSessions().remove(playerId);
    }

    private long allowedEloDifference(QueueEntry entry) {
        long secondsWaiting = Math.max(0, Instant.now().getEpochSecond() - entry.joinedAt().getEpochSecond());
        return Math.min(800, 100 + (secondsWaiting / 15) * 50);
    }

    private MatchStatus statusFor(OnlineMatch match, long playerId) {
        String team = match.getTeam(playerId);
        PlayerView opponentPlayer = "orange".equals(team) ? match.getBlue() : match.getOrange();
        OpponentView opponent = new OpponentView(opponentPlayer.name(), opponentPlayer.elo());
        return new MatchStatus("matched", match.getId(), team, opponent, 0);
    }

    private MatchStatus waitingStatus(QueueEntry entry) {
        long seconds = Math.max(0, Instant.now().getEpochSecond() - entry.joinedAt().getEpochSecond());
        return new MatchStatus("waiting", null, null, null, seconds);
    }

    private record QueueEntry(long playerId, PlayerView player, Instant joinedAt) {
    }

    public record MatchStatus(String status, String matchId, String team, OpponentView opponent, long waitingSeconds) {
    }

    public record OpponentView(String name, int elo) {
    }

    public record LobbyView(List<LobbyPlayer> waitingPlayers) {
    }

    public record LobbyPlayer(String name, int elo, long waitingSeconds) {
    }
}
