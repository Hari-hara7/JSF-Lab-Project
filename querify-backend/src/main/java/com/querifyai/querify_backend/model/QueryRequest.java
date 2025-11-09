package com.querifyai.querify_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueryRequest {
    private String prompt;
    private String chartType;
    private Integer limit;
}
