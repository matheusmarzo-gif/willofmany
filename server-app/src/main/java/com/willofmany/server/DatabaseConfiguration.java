package com.willofmany.server;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatabaseConfiguration {
    @Bean
    DataSource dataSource(
        @Value("${DATABASE_URL:}") String databaseUrl,
        @Value("${spring.datasource.url}") String defaultUrl,
        @Value("${spring.datasource.username:}") String defaultUsername,
        @Value("${spring.datasource.password:}") String defaultPassword
    ) {
        if (databaseUrl.isBlank()) {
            return DataSourceBuilder.create()
                .url(defaultUrl)
                .username(defaultUsername)
                .password(defaultPassword)
                .build();
        }

        ConnectionSettings settings = parseDatabaseUrl(
            databaseUrl,
            defaultUsername,
            defaultPassword
        );
        return DataSourceBuilder.create()
            .url(settings.jdbcUrl())
            .username(settings.username())
            .password(settings.password())
            .build();
    }

    static ConnectionSettings parseDatabaseUrl(String databaseUrl, String fallbackUsername, String fallbackPassword) {
        if (databaseUrl.startsWith("jdbc:postgresql://")) {
            return new ConnectionSettings(databaseUrl, fallbackUsername, fallbackPassword);
        }

        try {
            URI uri = URI.create(databaseUrl);
            if (!("postgres".equals(uri.getScheme()) || "postgresql".equals(uri.getScheme())) ||
                uri.getHost() == null ||
                uri.getRawPath() == null ||
                uri.getRawPath().length() < 2 ||
                uri.getRawQuery() == null ||
                uri.getRawQuery().isBlank()) {
                throw new IllegalArgumentException();
            }

            String rawAuthority = uri.getRawAuthority();
            String rawUserInfo = uri.getRawUserInfo();
            if (rawUserInfo == null || !rawAuthority.contains("@")) {
                throw new IllegalArgumentException();
            }
            int separator = rawUserInfo.indexOf(':');
            if (separator <= 0 || separator == rawUserInfo.length() - 1) {
                throw new IllegalArgumentException();
            }

            String username = decodeComponent(rawUserInfo.substring(0, separator));
            String password = decodeComponent(rawUserInfo.substring(separator + 1));
            String authorityWithoutCredentials = rawAuthority.substring(rawAuthority.indexOf('@') + 1);
            String jdbcUrl = "jdbc:postgresql://" + authorityWithoutCredentials +
                uri.getRawPath() + "?" + uri.getRawQuery();
            return new ConnectionSettings(jdbcUrl, username, password);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                "DATABASE_URL inválida. Use a URL PostgreSQL completa copiada do Neon.",
                exception
            );
        }
    }

    private static String decodeComponent(String component) {
        return URLDecoder.decode(component.replace("+", "%2B"), StandardCharsets.UTF_8);
    }

    record ConnectionSettings(String jdbcUrl, String username, String password) {
    }
}
