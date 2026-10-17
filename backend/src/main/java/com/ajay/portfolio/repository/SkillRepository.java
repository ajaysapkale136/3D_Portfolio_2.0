package com.ajay.portfolio.repository;

import com.ajay.portfolio.entity.SkillEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, Long> {
    List<SkillEntity> findAllByOrderByIdAsc();
    List<SkillEntity> findByCategoryIgnoreCaseOrderByIdAsc(String category);
}
