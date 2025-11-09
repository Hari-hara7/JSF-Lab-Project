package com.querifyai.querify_backend.controller;

import com.querifyai.querify_backend.model.QueryHistory;
import com.querifyai.querify_backend.repository.QueryHistoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HistoryController {

    private final QueryHistoryRepository historyRepository;

    public HistoryController(QueryHistoryRepository historyRepository) {
        this.historyRepository = historyRepository;
    }

    @GetMapping("/history")
    public List<QueryHistory> history() {
        return historyRepository.findAll().stream()
                .sorted((a,b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(200)
                .toList();
    }
}
