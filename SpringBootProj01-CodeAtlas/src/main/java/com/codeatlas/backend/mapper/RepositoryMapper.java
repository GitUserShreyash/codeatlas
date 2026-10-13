package com.codeatlas.backend.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.codeatlas.backend.dto.RepositoryResponse;
import com.codeatlas.backend.entity.Repository;

@Mapper(componentModel = "spring")
public interface RepositoryMapper {

    @Mapping(target = "isPrivate", source = "private")
    public RepositoryResponse toResponse(Repository repository);
}