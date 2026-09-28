package com.willofmany.server;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MatchResultService {
    private final PlayerRepository players;

    public MatchResultService(PlayerRepository players) {
        this.players = players;
    }

    @Transactional
    public Result record(OnlineMatch match, String winner) {
        Player orange = players.findById(match.getOrange().id())
            .orElseThrow(() -> new IllegalStateException("Laranja não está cadastrado."));
        Player blue = players.findById(match.getBlue().id())
            .orElseThrow(() -> new IllegalStateException("Azul não está cadastrado."));
        int oldOrange = orange.getElo();
        int oldBlue = blue.getElo();
        double expectedOrange = 1.0 / (1.0 + Math.pow(10.0, (oldBlue - oldOrange) / 400.0));
        double actualOrange = "orange".equals(winner) ? 1.0 : "blue".equals(winner) ? 0.0 : 0.5;
        int newOrange = Math.max(100, (int) Math.round(oldOrange + 32.0 * (actualOrange - expectedOrange)));
        int newBlue = Math.max(100, (int) Math.round(oldBlue + 32.0 * ((1.0 - actualOrange) - (1.0 - expectedOrange))));
        orange.setElo(newOrange);
        blue.setElo(newBlue);
        players.save(orange);
        players.save(blue);
        return new Result(
            new RatingView(orange.getDisplayName(), orange.getElo()),
            new RatingView(blue.getDisplayName(), blue.getElo())
        );
    }

    public record Result(RatingView orange, RatingView blue) {
    }

    public record RatingView(String name, int elo) {
    }
}
