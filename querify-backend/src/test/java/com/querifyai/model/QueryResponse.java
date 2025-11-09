package com.querifyai.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueryResponse {
    private String sql;
    private boolean validated;
    private List<Map<String, Object>> rows;
    private List<String> columns;
    private int rowCount;
    private String queryId;
    private String error; // optional
}
