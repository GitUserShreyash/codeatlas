package com.codeatlas.backend.service.ai;

import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

import com.codeatlas.backend.dto.CitationDto;

@Component
@RequiredArgsConstructor
public class CitationMapper {
	
	private final ObjectMapper objectMapper;

    public List<CitationDto> toCitations(List<Document> documents) {
        if (documents == null || documents.isEmpty()) {
            return List.of();
        }

        return documents.stream()
                .map(this::fromDocument)
                .distinct()
                .toList();
    }

    public CitationDto fromDocument(Document document) {
        Map<String, Object> metadata = document.getMetadata();

        String filePath = stringVal(metadata.get("filePath"));
        Integer startLine = intVal(metadata.get("startLine"));
        Integer endLine = intVal(metadata.get("endLine"));
        String language = stringVal(metadata.get("language"));

        return new CitationDto(
                filePath,
                startLine,
                endLine,
                language
        );
    }

    private static String stringVal(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private static Integer intVal(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }

        if (value == null) {
            return null;
        }

        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException e) {
            return null;
        }
    }
    
    public String toJson(List<CitationDto> citations) {
        try {
            return objectMapper.writeValueAsString(
                    citations == null ? List.of() : citations
            );
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                    "Failed to convert citations to JSON", e
            );
        }
    }
}
