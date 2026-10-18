package com.ajay.portfolio.repository;

import com.ajay.portfolio.entity.ContactMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);
    long countByEmailAndCreatedAtAfter(String email, LocalDateTime after);
    long countByClientIpAndCreatedAtAfter(String clientIp, LocalDateTime after);
}
