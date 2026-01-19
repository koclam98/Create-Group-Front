package com.example.meeting.repository;

import com.example.meeting.domain.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Meeting 엔티티를 위한 레포지토리 인터페이스.
 * 모임 작업을 위한 데이터베이스 접근 메서드를 제공합니다.
 */
@Repository
public interface MeetingRepository extends JpaRepository<Meeting, String> {

    /**
     * 최근 수정된 순서로 모든 모임을 조회합니다.
     *
     * @return updatedAt 기준 내림차순으로 정렬된 모임 목록
     */
    List<Meeting> findAllByOrderByUpdatedAtDesc();
}
