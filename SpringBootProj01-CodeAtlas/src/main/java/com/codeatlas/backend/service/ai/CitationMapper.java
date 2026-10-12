package com.codeatlas.backend.service.ai;

import java.util.List;
import java.util.Map;

import org.springframework.ai.document.Document;
import org.springframework.stereotype.Component;

import com.codeatlas.backend.dto.CitationDto;

@Component
public class CitationMapper {

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
}
