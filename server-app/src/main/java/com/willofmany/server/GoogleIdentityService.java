package com.willofmany.server;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class GoogleIdentityService {
    private final String clientId;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5))
        .build();

    public GoogleIdentityService(
        @Value("${willofmany.google.client-id:}") String clientId,
        ObjectMapper objectMapper
    ) {
        this.clientId = clientId.trim();
        this.objectMapper = objectMapper;
    }

    public String getClientId() {
        return clientId;
    }

    public VerifiedIdentity verify(String idToken) {
        if (clientId.isBlank()) {
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "O servidor ainda não foi configurado com o cliente OAuth do Google.");
        }
        if (idToken == null || idToken.isBlank() || idToken.length() > 10_000) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Credencial Google inválida.");
        }

        String encodedToken = URLEncoder.encode(idToken, StandardCharsets.UTF_8);
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodedToken))
            .timeout(Duration.ofSeconds(8))
            .GET()
            .build();
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "Não foi possível validar sua conta Google.");
            }
            JsonNode claims = objectMapper.readTree(response.body());
            if (!clientId.equals(claims.path("aud").asText()) ||
                !claims.path("email_verified").asText().equalsIgnoreCase("true") ||
                claims.path("sub").asText().isBlank() ||
                claims.path("email").asText().isBlank() ||
                !(claims.path("iss").asText().equals("accounts.google.com") ||
                    claims.path("iss").asText().equals("https://accounts.google.com"))) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "A credencial não representa uma conta Google verificada para este aplicativo.");
            }
            return new VerifiedIdentity(
                claims.path("sub").asText(),
                claims.path("email").asText().toLowerCase(),
                claims.path("name").asText("")
            );
        } catch (ApiException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new ApiException(HttpStatus.SERVICE_UNAVAILABLE, "A validação Google foi interrompida.");
        } catch (Exception exception) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Falha ao validar a identidade com o Google.");
        }
    }

    public record VerifiedIdentity(String subject, String email, String googleName) {
    }
}
