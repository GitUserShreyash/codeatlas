package com.codeatlas.backend.service.ai;

import java.util.List;

import com.codeatlas.backend.dto.CitationDto;

public record RetrievedContext (
		List<CitationDto> citation,
		String contextText){

}
