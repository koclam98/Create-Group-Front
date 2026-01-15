package com.example.meeting.repository;

import com.example.meeting.domain.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, String> {
    Optional<Participant> findByPhone(String phone);
    boolean existsByPhone(String phone);
}
