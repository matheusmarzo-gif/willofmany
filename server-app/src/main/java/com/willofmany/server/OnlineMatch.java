package com.willofmany.server;

import com.fasterxml.jackson.databind.JsonNode;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.web.socket.WebSocketSession;

public class OnlineMatch {
    private final String id;
    private final PlayerView orange;
    private final PlayerView blue;
    private final Map<Long, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private JsonNode gameState;
    private int currentTurn = 1;
    private String currentTeam = "orange";
    private boolean complete;

    public OnlineMatch(String id, PlayerView orange, PlayerView blue) {
        this.id = id;
        this.orange = orange;
        this.blue = blue;
    }

    public String getId() {
        return id;
    }

    public PlayerView getOrange() {
        return orange;
    }

    public PlayerView getBlue() {
        return blue;
    }

    public PlayerView getPlayer(String team) {
        return "orange".equals(team) ? orange : blue;
    }

    public String getTeam(long playerId) {
        if (orange.id().equals(playerId)) return "orange";
        if (blue.id().equals(playerId)) return "blue";
        return null;
    }

    public synchronized JsonNode getGameState() {
        return gameState;
    }

    public synchronized void setGameState(JsonNode state) {
        gameState = state == null ? null : state.deepCopy();
        if (state != null) {
            currentTeam = state.path("currentTeam").asText(currentTeam);
            currentTurn = state.path("currentTurn").asInt(currentTurn);
        }
    }

    public synchronized int getCurrentTurn() {
        return currentTurn;
    }

    public synchronized String getCurrentTeam() {
        return currentTeam;
    }

    public synchronized boolean isComplete() {
        return complete;
    }

    public synchronized void setComplete() {
        complete = true;
    }

    public synchronized boolean tryComplete() {
        if (complete) return false;
        complete = true;
        return true;
    }

    public Map<Long, WebSocketSession> getSessions() {
        return sessions;
    }
}
