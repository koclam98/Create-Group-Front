package com.example.meeting.repository;

import com.example.meeting.domain.Participant;
import com.example.meeting.exception.ResourceNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Participant 엔티티를 위한 레포지토리 인터페이스.
 * 참여자 작업을 위한 데이터베이스 접근 메서드를 제공합니다.
 */
@Repository
public interface ParticipantRepository extends JpaRepository<Participant, String> {

    /**
     * 전화번호로 참여자를 조회합니다.
     *
     * @param phone 검색할 전화번호
     * @return 참여자를 포함하는 Optional (찾은 경우)
     */
    Optional<Participant> findByPhone(String phone);

    /**
     * 주어진 전화번호를 가진 참여자가 존재하는지 확인합니다.
     *
     * @param phone 확인할 전화번호
     * @return 이 전화번호를 가진 참여자가 존재하면 true, 그렇지 않으면 false
     */
    boolean existsByPhone(String phone);

    default Participant getById(String id) {
        return findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("참여자를 찾을 수 없습니다."));
    }

    @Modifying
    @Query(value = "DELETE FROM meeting_participants WHERE participant_id = :id", nativeQuery = true)
    void removeFromAllMeetings(@Param("id") String id);

}
