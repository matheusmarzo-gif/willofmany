package com.willofmany.server;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class MatchmakingServiceTest {
    @Test
    void pairsPlayersInTheConfiguredEloWindowAndAssignsTeams() {
        MatchmakingService matchmaking = new MatchmakingService();
        PlayerView first = player(1L, "First", 1200);
        PlayerView second = player(2L, "Second", 1290);

        MatchmakingService.MatchStatus firstStatus = matchmaking.join(first);
        MatchmakingService.MatchStatus secondStatus = matchmaking.join(second);

        assertEquals("waiting", firstStatus.status());
        assertEquals("matched", secondStatus.status());
        assertEquals("blue", secondStatus.team());
        MatchmakingService.MatchStatus refreshedFirst = matchmaking.status(1L);
        assertEquals("matched", refreshedFirst.status());
        assertEquals("orange", refreshedFirst.team());
        assertEquals(second.name(), refreshedFirst.opponent().name());
        assertEquals(second.elo(), refreshedFirst.opponent().elo());
    }

    @Test
    void doesNotMatchPlayersOutsideInitialEloWindow() {
        MatchmakingService matchmaking = new MatchmakingService();
        matchmaking.join(player(1L, "First", 1200));

        MatchmakingService.MatchStatus status = matchmaking.join(player(2L, "Second", 1400));

        assertEquals("waiting", status.status());
    }

    private PlayerView player(Long id, String name, int elo) {
        return new PlayerView(id, name.toLowerCase() + "@example.com", name, elo);
    }
}
