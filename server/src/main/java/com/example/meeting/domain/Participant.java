package com.example.meeting.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 모임 시스템의 참여자를 나타내는 엔티티.
 * 참여자는 하나의 프로필을 가질 수 있으며 여러 모임에 참여할 수 있습니다.
 */
@Entity
@Table(name = "participants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {

    /**
     * 참여자의 고유 식별자 (UUID)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 참여자의 이름
     */
    @Column(nullable = false)
    private String name;

    /**
     * 참여자의 직함
     */
    @Column(nullable = false)
    private String position;

    /**
     * 참여자가 속한 기수 또는 코호트
     */
    @Column(nullable = false)
    private String season;

    /**
     * 참여자의 전화번호 (고유해야 함)
     */
    @Column(nullable = false, unique = true)
    private String phone;

    /**
     * 이 참여자와 연관된 프로필 (일대일 관계)
     * 모든 작업을 전파하고 고아 프로필을 제거합니다
     */
    @OneToOne(mappedBy = "participant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Profile profile;

    /**
     * 이 참여자가 참여하는 모임 목록 (다대다 관계)
     */
    @ManyToMany(mappedBy = "participants", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Meeting> meetings = new ArrayList<>();

    /**
     * 참여자가 생성된 타임스탬프
     */
    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /**
     * 참여자가 마지막으로 수정된 타임스탬프
     */
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
