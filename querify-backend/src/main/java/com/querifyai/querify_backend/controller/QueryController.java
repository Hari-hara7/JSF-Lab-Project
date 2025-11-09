package com.querifyai.querify_backend.controller;

import com.querifyai.querify_backend.model.QueryRequest;
import com.querifyai.querify_backend.model.QueryResponse;
import com.querifyai.querify_backend.service.QueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // adjust origin(s) for production
public class QueryController {

    private final QueryService queryService;

    public QueryController(QueryService queryService) {
        this.queryService = queryService;
    }

    @PostMapping("/query")
    public ResponseEntity<?> runQuery(@RequestBody QueryRequest request) {
        // Basic validation
        if (request.getPrompt() == null || request.getPrompt().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("prompt is required");
        }
        QueryResponse resp = queryService.handleQuery(request);
        if (!resp.isValidated()) {
            // return 400 with message if validation failed or AI returned invalid SQL
            return ResponseEntity.badRequest().body(resp);
        }
        return ResponseEntity.ok(resp);
    }
}
