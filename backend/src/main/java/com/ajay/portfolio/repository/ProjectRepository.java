package com.ajay.portfolio.repository;

import com.ajay.portfolio.entity.ProjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {
    List<ProjectEntity> findByPublishedTrueOrderByIdAsc();
    List<ProjectEntity> findByPublishedTrueAndCategoryIgnoreCaseOrderByIdAsc(String category);
    Optional<ProjectEntity> findByIdAndPublishedTrue(Long id);
}
