package com.willofmany.server;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
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
}
