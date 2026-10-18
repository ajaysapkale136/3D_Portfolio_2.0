package com.ajay.portfolio.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    private final Environment environment;

    @Value("${spring.datasource.url:jdbc:mysql://mysql-2f100eb1-portfolio-3d-0.j.aivencloud.com:11624/defaultdb?sslMode=REQUIRED&allowPublicKeyRetrieval=true}")
    private String dbUrl;

    @Value("${spring.datasource.username:avnadmin}")
    private String dbUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:}}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Value("${app.datasource.allow-h2-fallback:false}")
    private boolean allowH2Fallback;

    public DataSourceConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    @Primary
    public DataSource dataSource() {
        boolean mysqlAvailable = false;
        Exception connectionException = null;

        try {
            Class.forName(driverClassName);
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
                if (conn.isValid(3)) {
                    mysqlAvailable = true;
                    log.info("Successfully connected to primary MySQL database at: {}", dbUrl);
                }
            }
        } catch (Exception ex) {
            connectionException = ex;
            log.error("Could not connect to required MySQL database at [{}]: {}", dbUrl, ex.getMessage());
        }

        if (mysqlAvailable) {
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(dbUrl);
            config.setUsername(dbUsername);
            config.setPassword(dbPassword);
            config.setDriverClassName(driverClassName);
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setPoolName("MySQL-HikariPool");
            return new HikariDataSource(config);
        }

        // Enforce strict production safety: fail immediately if database is unavailable
        boolean isProduction = environment.acceptsProfiles(Profiles.of("prod", "production"))
                || "true".equalsIgnoreCase(System.getenv("PRODUCTION"))
                || "production".equalsIgnoreCase(System.getenv("NODE_ENV"))
                || !allowH2Fallback;

        if (isProduction) {
            String errorMsg = String.format(
                    "CRITICAL DATABASE FAILURE: Application is configured for production, but failed to connect to the required MySQL database at [%s]. " +
                    "Silent fallback to embedded H2 database is strictly prohibited in production to prevent silent data diversion. Startup aborted.",
                    dbUrl
            );
            log.error(errorMsg);
            throw new IllegalStateException(errorMsg, connectionException);
        }

        // Only permitted in local development when explicitly opted in
        log.warn("==========================================================================");
        log.warn("DEVELOPMENT NOTICE: Primary MySQL database is unreachable. Starting embedded H2");
        log.warn("database because app.datasource.allow-h2-fallback=true in development profile.");
        log.warn("==========================================================================");

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:file:./data/portfolio;DB_CLOSE_DELAY=-1;MODE=MySQL");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        config.setPoolName("H2-Dev-FallbackPool");
        return new HikariDataSource(config);
    }
}
