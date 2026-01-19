package com.example.meeting.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * 참여자의 프로필을 나타내는 엔티티.
 * 프로필 이미지 URL과 같은 추가 정보를 포함합니다.
 * 각 프로필은 정확히 한 명의 참여자와 연관됩니다 (일대일 관계).
 */
@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    /**
     * 프로필의 고유 식별자 (UUID)
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    /**
     * 참여자의 프로필 이미지 URL
     * 긴 URL을 수용하기 위해 TEXT로 저장됩니다
     */
    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    /**
     * 이 프로필이 속한 참여자 (일대일 관계)
     * JsonIgnore는 직렬화 중 순환 참조를 방지합니다
     */
    @OneToOne
    @JoinColumn(name = "participant_id", unique = true)
    @JsonIgnore
    private Participant participant;
}
