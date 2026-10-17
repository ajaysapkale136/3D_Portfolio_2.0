package com.ajay.portfolio.repository;

import com.ajay.portfolio.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    long countByEmailAndCreatedAtAfter(String email, LocalDateTime after);
    long countByClientIpAndCreatedAtAfter(String clientIp, LocalDateTime after);
}
