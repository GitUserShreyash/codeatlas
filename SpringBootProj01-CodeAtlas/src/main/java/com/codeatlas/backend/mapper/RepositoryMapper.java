package com.codeatlas.backend.mapper;

import org.mapstruct.Mapper;

import com.codeatlas.backend.dto.RepositoryResponse;
import com.codeatlas.backend.entity.Repository;

@Mapper(componentModel = "spring")
public interface RepositoryMapper {

    RepositoryResponse toResponse(Repository repository);
}