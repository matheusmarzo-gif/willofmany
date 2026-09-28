package com.willofmany.server;

import java.util.Map;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Configuration
@EnableWebSocket
public class OnlineWebSocketConfig implements WebSocketConfigurer {
    private final OnlineGameHandler gameHandler;
    private final SessionService sessions;
    private final PlayerRepository players;
    private final MatchmakingService matchmaking;

    public OnlineWebSocketConfig(
        OnlineGameHandler gameHandler,
        SessionService sessions,
        PlayerRepository players,
        MatchmakingService matchmaking
    ) {
        this.gameHandler = gameHandler;
        this.sessions = sessions;
        this.players = players;
        this.matchmaking = matchmaking;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(gameHandler, "/ws/game")
            .addInterceptors(new HandshakeInterceptor() {
                @Override
                public boolean beforeHandshake(
                    ServerHttpRequest request,
                    ServerHttpResponse response,
                    WebSocketHandler handler,
                    Map<String, Object> attributes
                ) {
                    String query = request.getURI().getRawQuery();
                    Map<String, String> params = QueryParams.parse(query);
                    Player player = sessions.resolveToken(params.get("token"), players);
                    String matchId = params.get("matchId");
                    if (player == null || matchId == null) return false;
                    try {
                        OnlineMatch match = matchmaking.requireMatch(matchId, player.getId());
                        attributes.put("playerId", player.getId());
                        attributes.put("matchId", match.getId());
                        attributes.put("team", match.getTeam(player.getId()));
                        return true;
                    } catch (ApiException exception) {
                        return false;
                    }
                }

                @Override
                public void afterHandshake(
                    ServerHttpRequest request,
                    ServerHttpResponse response,
                    WebSocketHandler handler,
                    Exception exception
                ) {
                }
            });
    }

    private static class QueryParams {
        static Map<String, String> parse(String query) {
            java.util.HashMap<String, String> result = new java.util.HashMap<>();
            if (query == null) return result;
            for (String pair : query.split("&")) {
                String[] parts = pair.split("=", 2);
                if (parts.length == 2) {
                    result.put(
                        java.net.URLDecoder.decode(parts[0], java.nio.charset.StandardCharsets.UTF_8),
                        java.net.URLDecoder.decode(parts[1], java.nio.charset.StandardCharsets.UTF_8)
                    );
                }
            }
            return result;
        }
    }
}
