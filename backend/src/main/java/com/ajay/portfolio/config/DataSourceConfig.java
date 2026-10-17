package com.ajay.portfolio.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://mysql-2f100eb1-portfolio-3d-0.j.aivencloud.com:11624/defaultdb?sslMode=REQUIRED&allowPublicKeyRetrieval=true}")
    private String dbUrl;

    @Value("${spring.datasource.username:avnadmin}")
    private String dbUsername;

    @Value("${spring.datasource.password:${DB_PASSWORD:}}")
    private String dbPassword;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        boolean mysqlAvailable = false;
        try {
            Class.forName(driverClassName);
            try (Connection conn = DriverManager.getConnection(dbUrl, dbUsername, dbPassword)) {
                if (conn.isValid(2)) {
                    mysqlAvailable = true;
                    log.info("Successfully connected to primary MySQL database at: {}", dbUrl);
                }
            }
        } catch (Exception ex) {
            log.warn("Could not connect to MySQL database ({}: {}). Falling back to embedded local database so the application starts cleanly.",
                    ex.getClass().getSimpleName(), ex.getMessage());
        }

        HikariConfig config = new HikariConfig();
        if (mysqlAvailable) {
            config.setJdbcUrl(dbUrl);
            config.setUsername(dbUsername);
            config.setPassword(dbPassword);
            config.setDriverClassName(driverClassName);
            config.setMaximumPoolSize(10);
            config.setPoolName("MySQL-HikariPool");
            return new HikariDataSource(config);
        } else {
            log.info("Starting with embedded database (jdbc:h2:file:./data/portfolio;MODE=MySQL) for zero-setup local development.");
            config.setJdbcUrl("jdbc:h2:file:./data/portfolio;DB_CLOSE_DELAY=-1;MODE=MySQL");
            config.setDriverClassName("org.h2.Driver");
            config.setUsername("sa");
            config.setPassword("");
            config.setPoolName("H2-FallbackPool");
            return new HikariDataSource(config);
        }
    }
}
