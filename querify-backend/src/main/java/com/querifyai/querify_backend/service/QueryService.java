package com.querifyai.querify_backend.service;

import com.querifyai.querify_backend.model.QueryHistory;
import com.querifyai.querify_backend.model.QueryRequest;
import com.querifyai.querify_backend.model.QueryResponse;
import com.querifyai.querify_backend.repository.QueryHistoryRepository;
import com.querifyai.querify_backend.util.SqlValidator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QueryService {

    private final GeminiService geminiService;
    private final SqlValidator sqlValidator;
    private final JdbcTemplate jdbcTemplate;
    private final QueryHistoryRepository historyRepository;

    public QueryService(GeminiService geminiService,
                        SqlValidator sqlValidator,
                        JdbcTemplate jdbcTemplate,
                        QueryHistoryRepository historyRepository) {
        this.geminiService = geminiService;
        this.sqlValidator = sqlValidator;
        this.jdbcTemplate = jdbcTemplate;
        this.historyRepository = historyRepository;
    }

    /**
     * Run a user query -> generate SQL via Gemini -> validate -> execute -> persist history
     */
    public QueryResponse handleQuery(QueryRequest req) {
        try {
            // 1. Build schema summary (basic)
            String schemaSummary = buildSchemaSummary();

            // 2. Call Gemini to generate SQL
            String aiSql = geminiService.generateSql(req.getPrompt(), schemaSummary);
            if (aiSql == null || aiSql.isBlank()) {
                return errorResponse("Gemini returned empty SQL.");
            }

            // Trim and clean some common chat artifacts (strip markdown fences)
            String cleaned = aiSql.trim()
                    .replaceAll("^```sql\\s*", "")
                    .replaceAll("```\\s*$", "")
                    .trim();

            // 3. Validate SQL only SELECT
            boolean valid = sqlValidator.isSelectOnly(cleaned);
            if (!valid) {
                // Save history flagged invalid
                QueryHistory h = new QueryHistory(req.getPrompt(), cleaned, false, 0, req.getChartType());
                historyRepository.save(h);
                return errorResponse("Generated SQL is not valid or not allowed (only SELECT allowed).");
            }

            // 4. Enforce limit
            String finalSql = sqlValidator.enforceLimit(cleaned, req.getLimit());

            // 5. Execute query using JdbcTemplate
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(finalSql);

            // 6. Columns
            List<String> columns = rows.isEmpty() ? Collections.emptyList() : new ArrayList<>(rows.get(0).keySet());

            // 7. Save history with row count
            QueryHistory history = historyRepository.save(new QueryHistory(req.getPrompt(), finalSql, true, rows.size(), req.getChartType()));

            // 8. Build response
            QueryResponse resp = new QueryResponse();
            resp.setSql(finalSql);
            resp.setValidated(true);
            resp.setRows(rows);
            resp.setColumns(columns);
            resp.setRowCount(rows.size());
            resp.setQueryId(history.getId().toString());
            return resp;
        } catch (Exception ex) {
            return errorResponse("Server error: " + ex.getMessage());
        }
    }

    private QueryResponse errorResponse(String msg) {
        QueryResponse r = new QueryResponse();
        r.setValidated(false);
        r.setError(msg);
        r.setRows(Collections.emptyList());
        r.setColumns(Collections.emptyList());
        r.setRowCount(0);
        return r;
    }

    /**
     * Simple schema summary: list all public tables and first few columns.
     * This is intentionally lightweight; you can cache it for production.
     */
    private String buildSchemaSummary() {
        try {
            String tablesSql = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'";
            List<String> tables = jdbcTemplate.queryForList(tablesSql, String.class);
            StringBuilder sb = new StringBuilder();

            for (String t : tables) {
                sb.append(t).append(": ");
                String colsSql = "SELECT column_name FROM information_schema.columns WHERE table_name = ? ORDER BY ordinal_position LIMIT 6";
                List<String> cols = jdbcTemplate.queryForList(colsSql, new Object[]{t}, String.class);
                sb.append(String.join(", ", cols)).append(". ");
            }
            return sb.toString();
        } catch (Exception ex) {
            // if schema read fails, return empty
            return "";
        }
    }
}