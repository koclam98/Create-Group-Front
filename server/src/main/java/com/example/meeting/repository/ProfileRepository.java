package com.example.meeting.repository;

import com.example.meeting.domain.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Profile 엔티티를 위한 레포지토리 인터페이스.
 * 프로필 작업을 위한 데이터베이스 접근 메서드를 제공합니다.
 */
@Repository
public interface ProfileRepository extends JpaRepository<Profile, String> {

    /**
     * 참여자 ID로 프로필을 조회합니다.
     *
     * @param participantId 검색할 참여자 ID
     * @return 프로필을 포함하는 Optional (찾은 경우)
     */
    Optional<Profile> findByParticipantId(String participantId);
}
