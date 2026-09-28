package com.willofmany.server;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
    private final GoogleIdentityService googleIdentity;
    private final PlayerRepository players;
    private final SessionService sessions;

    public AuthController(
        GoogleIdentityService googleIdentity,
        PlayerRepository players,
        SessionService sessions
    ) {
        this.googleIdentity = googleIdentity;
        this.players = players;
        this.sessions = sessions;
    }

    @GetMapping("/config")
    public ServerConfig config() {
        return new ServerConfig(googleIdentity.getClientId());
    }

    @PostMapping("/auth/google")
    public AuthResponse login(@Valid @RequestBody GoogleLoginRequest request) {
        GoogleIdentityService.VerifiedIdentity identity = googleIdentity.verify(request.idToken());
        Player player = players.findByGoogleSubject(identity.subject())
            .map(existing -> {
                existing.updateProfile(identity.email(), chooseName(request.name(), existing.getDisplayName(), identity.email()));
                return players.save(existing);
            })
            .orElseGet(() -> players.save(new Player(
                identity.subject(),
                identity.email(),
                chooseName(request.name(), identity.googleName(), identity.email())
            )));
        return new AuthResponse(sessions.create(player), PlayerView.from(player));
    }

    @GetMapping("/me")
    public PlayerView me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return PlayerView.from(sessions.requirePlayer(authorization, players));
    }

    private String chooseName(String submitted, String fallback, String email) {
        String value = submitted == null || submitted.isBlank() ? fallback : submitted;
        if (value == null || value.isBlank()) value = email.substring(0, email.indexOf('@'));
        String normalized = value.trim().replaceAll("\\s+", " ");
        if (normalized.length() < 2 || normalized.length() > 32) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "O nome deve ter entre 2 e 32 caracteres.");
        }
        return normalized;
    }

    public record ServerConfig(String googleClientId) {
    }

    public record GoogleLoginRequest(
        @NotBlank @Size(max = 10_000) String idToken,
        @Size(max = 32) String name
    ) {
    }

    public record AuthResponse(String token, PlayerView player) {
    }
}
