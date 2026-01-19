package com.example.meeting.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 시스템의 모임을 나타내는 엔티티.
 * 모임은 기본 정보를 가지며 여러 참여자를 가질 수 있습니다 (다대다 관계).
 */
@Entity
@Table(name = "meetings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Meeting {

    /**
     * 모임의 고유 식별자 (UUID)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 모임의 제목
     */
    @Column(nullable = false)
    private String title;

    /**
     * 모임의 상세 설명
     * 긴 설명을 수용하기 위해 TEXT로 저장됩니다
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String desc;

    /**
     * 모임이 예정된 날짜 및 시간
     */
    @Column(nullable = false)
    private LocalDateTime date;

    /**
     * 모임이 열릴 장소
     */
    @Column(nullable = false)
    private String location;

    /**
     * 모임이 생성된 타임스탬프
     */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /**
     * 모임이 마지막으로 수정된 타임스탬프
     */
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    /**
     * 이 모임에 참석하는 참여자 목록 (다대다 관계)
     * 조인 테이블 "meeting_participants"가 관계를 관리합니다
     */
    @ManyToMany
    @JoinTable(
            name = "meeting_participants",
            joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "participant_id")
    )
    @Builder.Default
    private List<Participant> participants = new ArrayList<>();
}
