package com.querifyai.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class SqlValidator {

    // Disallow dangerous DML / DDL keywords
    private static final Pattern DANGEROUS = Pattern.compile("(?i)\\b(insert|update|delete|drop|alter|truncate|create|grant|revoke|replace|copy|call|execute)\\b");
    private static final Pattern SELECT_START = Pattern.compile("(?i)^\\s*select\\b");

    @Value("${querify.query.defaultLimit:500}")
    private int defaultLimit;

    public boolean isSelectOnly(String sql) {
        if (sql == null) return false;
        String normalized = sql.trim();
        // must begin with SELECT
        if (!SELECT_START.matcher(normalized).find()) return false;
        // no semicolons (prevent multiple statements)
        if (normalized.contains(";")) return false;
        // no dangerous keywords
        if (DANGEROUS.matcher(normalized).find()) return false;
        return true;
    }

    public String enforceLimit(String sql, Integer requestedLimit) {
        if (sql == null) return sql;
        String lower = sql.toLowerCase();
        if (lower.contains("limit")) return sql; // trust AI if it provides limit
        int limit = (requestedLimit == null || requestedLimit <= 0) ? defaultLimit : requestedLimit;
        return sql + " LIMIT " + limit;
    }
}
