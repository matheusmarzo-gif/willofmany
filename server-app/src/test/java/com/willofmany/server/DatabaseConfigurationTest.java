package com.willofmany.server;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class DatabaseConfigurationTest {
    @Test
    void convertsNeonPostgresUrlToJdbcWithoutLosingSslOrPoolerParameters() {
        DatabaseConfiguration.ConnectionSettings settings = DatabaseConfiguration.parseDatabaseUrl(
            "postgresql://db_user:secret%2Bvalue@ep-example-pooler.neon.tech/game?sslmode=require&channel_binding=require",
            "",
            ""
        );

        assertEquals(
            "jdbc:postgresql://ep-example-pooler.neon.tech/game?sslmode=require&channel_binding=require",
            settings.jdbcUrl()
        );
        assertEquals("db_user", settings.username());
        assertEquals("secret+value", settings.password());
    }

    @Test
    void acceptsAnAlreadyConvertedJdbcUrl() {
        DatabaseConfiguration.ConnectionSettings settings = DatabaseConfiguration.parseDatabaseUrl(
            "jdbc:postgresql://db.example/game?sslmode=require",
            "db_user",
            "db_password"
        );

        assertEquals("jdbc:postgresql://db.example/game?sslmode=require", settings.jdbcUrl());
        assertEquals("db_user", settings.username());
        assertEquals("db_password", settings.password());
    }

    @Test
    void rejectsMalformedPostgresUrlsWithoutEchoingCredentials() {
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> DatabaseConfiguration.parseDatabaseUrl("postgresql://user:secret@host/database", "", "")
        );

        assertEquals("DATABASE_URL inválida. Use a URL PostgreSQL completa copiada do Neon.", exception.getMessage());
    }
}
