package com.willofmany.server;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class SessionService {
    private final SecureRandom random = new SecureRandom();
    private final Map<String, Long> sessions = new ConcurrentHashMap<>();

    public String create(Player player) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        sessions.put(token, player.getId());
        return token;
    }

    public Player requirePlayer(String authorization, PlayerRepository players) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Entre com sua conta Google.");
        }
        Long playerId = sessions.get(authorization.substring(7).trim());
        if (playerId == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Sessão expirada. Entre novamente.");
        }
        return players.findById(playerId)
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Conta de jogador não encontrada."));
    }

    public Player resolveToken(String token, PlayerRepository players) {
        Long playerId = sessions.get(token);
        if (playerId == null) return null;
        return players.findById(playerId).orElse(null);
    }
}
