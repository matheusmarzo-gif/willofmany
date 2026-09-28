package com.willofmany.server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MatchmakingController {
    private final PlayerRepository players;
    private final SessionService sessions;
    private final MatchmakingService matchmaking;

    public MatchmakingController(
        PlayerRepository players,
        SessionService sessions,
        MatchmakingService matchmaking
    ) {
        this.players = players;
        this.sessions = sessions;
        this.matchmaking = matchmaking;
    }

    @GetMapping("/lobby")
    public MatchmakingService.LobbyView lobby(
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Player player = sessions.requirePlayer(authorization, players);
        return matchmaking.lobby(player.getId());
    }

    @PostMapping("/matchmaking/join")
    public MatchmakingService.MatchStatus join(
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Player player = sessions.requirePlayer(authorization, players);
        return matchmaking.join(player);
    }

    @GetMapping("/matchmaking/status")
    public MatchmakingService.MatchStatus status(
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Player player = sessions.requirePlayer(authorization, players);
        return matchmaking.status(player.getId());
    }

    @PostMapping("/matchmaking/leave")
    public MatchmakingService.MatchStatus leave(
        @RequestHeader(value = "Authorization", required = false) String authorization
    ) {
        Player player = sessions.requirePlayer(authorization, players);
        matchmaking.leaveQueue(player.getId());
        return matchmaking.status(player.getId());
    }
}
