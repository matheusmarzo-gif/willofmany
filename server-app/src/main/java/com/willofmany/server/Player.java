package com.willofmany.server;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.Instant;

@Entity
@Table(name = "players", uniqueConstraints = {
    @UniqueConstraint(name = "uk_player_google_subject", columnNames = "google_subject"),
    @UniqueConstraint(name = "uk_player_email", columnNames = "email")
})
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "google_subject", nullable = false, updatable = false)
    private String googleSubject;

    @Column(nullable = false)
    private String email;

    @Column(name = "display_name", nullable = false, length = 32)
    private String displayName;

    @Column(nullable = false)
    private int elo = 1200;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    protected Player() {
    }

    public Player(String googleSubject, String email, String displayName) {
        this.googleSubject = googleSubject;
        this.email = email;
        this.displayName = displayName;
        this.elo = 1200;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void updateProfile(String email, String displayName) {
        this.email = email;
        this.displayName = displayName;
        this.updatedAt = Instant.now();
    }

    public void setElo(int elo) {
        this.elo = elo;
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getGoogleSubject() {
        return googleSubject;
    }

    public String getEmail() {
        return email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public int getElo() {
        return elo;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
