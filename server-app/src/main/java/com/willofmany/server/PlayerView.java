package com.willofmany.server;

public record PlayerView(Long id, String email, String name, int elo) {
    public static PlayerView from(Player player) {
        return new PlayerView(player.getId(), player.getEmail(), player.getDisplayName(), player.getElo());
    }
}
