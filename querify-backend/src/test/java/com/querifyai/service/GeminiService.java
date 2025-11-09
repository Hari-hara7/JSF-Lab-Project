package com.querifyai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.url}")
    private String geminiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    /**
     * Build a brief schema-aware system prompt and call Gemini to generate SQL.
     * @param userPrompt user's natural language question
     * @param schemaSummary concise DB schema summary (optional)
     * @return String containing SQL (preferably single SELECT statement)
     * @throws Exception on API issues
     */
    public String generateSql(String userPrompt, String schemaSummary) throws Exception {
        String system = "You are an assistant that MUST output a single valid PostgreSQL SELECT query only. "
                + "Do not add explanations, do not wrap in markdown, do not add trailing semicolons. "
                + "If the user request cannot be answered, return a valid SELECT that returns zero rows (e.g. SELECT NULL WHERE false).";

        String fullPrompt = system
                + (schemaSummary != null && !schemaSummary.isBlank() ? "\nDatabase schema: " + schemaSummary : "")
                + "\nUser question: " + userPrompt
                + "\nReturn only the SQL SELECT statement.";

        // Build request body - structure may need to be adapted to exact Gemini API shape.
        Map<String, Object> body = new HashMap<>();
        // Some Gemini endpoints expect { "prompt": "..."} or a message list; adapt if needed.
        body.put("prompt", fullPrompt);
        // Optionally tune model params
        body.put("temperature", 0.0);
        body.put("maxOutputTokens", 1024);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            // If API uses bearer
            headers.setBearerAuth(geminiApiKey);
        }

        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> resp = restTemplate.exchange(geminiUrl, HttpMethod.POST, request, String.class);

        if (resp.getStatusCode() != HttpStatus.OK) {
            throw new RuntimeException("Gemini API returned status " + resp.getStatusCodeValue());
        }

        String respBody = resp.getBody();
        if (respBody == null || respBody.isEmpty()) throw new RuntimeException("Empty response from Gemini");

        // Try to parse likely fields (many Gemini responses include candidates → content → parts → text)
        JsonNode root = mapper.readTree(respBody);

        // Search common paths
        // 1) candidates[0].content.parts[0].text
        try {
            JsonNode node = root.path("candidates");
            if (node.isArray() && node.size() > 0) {
                JsonNode content = node.get(0).path("content");
                JsonNode parts = content.path("parts");
                if (parts.isArray() && parts.size() > 0) {
                    JsonNode text = parts.get(0).path("text");
                    if (!text.isMissingNode() && text.isTextual()) {
                        return text.asText().trim();
                    }
                }
            }
        } catch (Exception ignored) {}

        // 2) output[0].content[0].text (older formats)
        try {
            JsonNode out = root.path("output");
            if (out.isArray() && out.size() > 0) {
                JsonNode content = out.get(0).path("content");
                if (content.isArray() && content.size() > 0) {
                    JsonNode text = content.get(0).path("text");
                    if (!text.isMissingNode() && text.isTextual()) return text.asText().trim();
                }
            }
        } catch (Exception ignored) {}

        // 3) top-level "text"
        JsonNode textNode = root.path("text");
        if (!textNode.isMissingNode() && textNode.isTextual()) {
            return textNode.asText().trim();
        }

        // 4) fallback: entire JSON as string (not ideal)
        return respBody.trim();
    }
}
