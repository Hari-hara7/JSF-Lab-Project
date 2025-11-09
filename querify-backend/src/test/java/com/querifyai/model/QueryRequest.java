package com.querifyai.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QueryRequest {
    private String prompt;
    private String chartType; // optional: "table" | "bar" | "line" | "pie"
    private Integer limit;    // optional
}
