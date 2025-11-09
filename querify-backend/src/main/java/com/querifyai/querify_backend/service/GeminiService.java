package com.querifyai.querify_backend.service;

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
        String systemInstruction = "You are an assistant that MUST output a single valid PostgreSQL SELECT query only. "
                + "Do not add explanations, do not wrap in markdown, do not add trailing semicolons. "
                + "If the user request cannot be answered, return a valid SELECT that returns zero rows (e.g. SELECT NULL WHERE false).";

        String fullPrompt = systemInstruction
                + (schemaSummary != null && !schemaSummary.isBlank() ? "\nDatabase schema: " + schemaSummary : "")
                + "\nUser question: " + userPrompt
                + "\nReturn only the SQL SELECT statement.";

        // Build Gemini 2.0 API request body
        Map<String, Object> body = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        List<Map<String, String>> parts = new ArrayList<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", fullPrompt);
        parts.add(part);
        content.put("parts", parts);
        contents.add(content);
        body.put("contents", contents);
        
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.0);
        generationConfig.put("maxOutputTokens", 1024);
        body.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Gemini uses API key as query parameter
        String urlWithKey = geminiUrl + "?key=" + geminiApiKey;
        HttpEntity<Map<String,Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> resp = restTemplate.exchange(urlWithKey, HttpMethod.POST, request, String.class);

        if (!resp.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Gemini API returned status " + resp.getStatusCode() + ": " + resp.getBody());
        }

        String respBody = resp.getBody();
        if (respBody == null || respBody.isEmpty()) {
            throw new RuntimeException("Empty response from Gemini");
        }

        // Try to parse likely fields (many Gemini responses include candidates → content → parts → text)
        JsonNode root = mapper.readTree(respBody);

        // Search common paths
        // 1) candidates[0].content.parts[0].text
        try {
            JsonNode node = root.path("candidates");
            if (node.isArray() && node.size() > 0) {
                JsonNode contentNode = node.get(0).path("content");
                JsonNode partsNode = contentNode.path("parts");
                if (partsNode.isArray() && partsNode.size() > 0) {
                    JsonNode text = partsNode.get(0).path("text");
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
                JsonNode contentNode2 = out.get(0).path("content");
                if (contentNode2.isArray() && contentNode2.size() > 0) {
                    JsonNode text = contentNode2.get(0).path("text");
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