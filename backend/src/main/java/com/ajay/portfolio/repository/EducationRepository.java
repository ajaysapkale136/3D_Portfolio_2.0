package com.ajay.portfolio.repository;

import com.ajay.portfolio.entity.EducationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EducationRepository extends JpaRepository<EducationEntity, Long> {
    List<EducationEntity> findAllByOrderByIdAsc();
}
