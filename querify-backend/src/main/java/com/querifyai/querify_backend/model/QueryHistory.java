package com.querifyai.querify_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "querify_queries")
@Data
@NoArgsConstructor
public class QueryHistory {

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(columnDefinition = "text")
    private String userId; // optional

    @Column(columnDefinition = "text", nullable = false)
    private String prompt;

    @Column(columnDefinition = "text", nullable = false)
    private String generatedSql;

    private boolean validated;

    private Integer resultRowCount;

    private String chartType;

    private OffsetDateTime createdAt = OffsetDateTime.now();

    public QueryHistory(String prompt, String generatedSql, boolean validated, Integer resultRowCount, String chartType) {
        this.prompt = prompt;
        this.generatedSql = generatedSql;
        this.validated = validated;
        this.resultRowCount = resultRowCount;
        this.chartType = chartType;
        this.createdAt = OffsetDateTime.now();
    }
}