package com.example.meeting.dto;

import com.example.meeting.domain.Participant;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Participant 작업을 위한 데이터 전송 객체.
 * 생성, 수정 및 응답을 위한 DTO를 포함합니다.
 */
public class ParticipantDto {

    /**
     * 새로운 참여자 생성을 위한 DTO.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {

        /**
         * 참여자의 이름 (필수)
         */
        @NotBlank(message = "이름은 필수입니다")
        private String name;

        /**
         * 참여자의 기수 또는 코호트 (필수)
         */
        @NotBlank(message = "기수는 필수입니다")
        private String season;

        /**
         * 참여자의 전화번호 (필수, 고유해야 함)
         */
        @NotBlank(message = "연락처는 필수입니다")
        private String phone;
    }

    /**
     * 기존 참여자 수정을 위한 DTO.
     * 모든 필드는 선택 사항입니다.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {

        /**
         * 수정할 이름 (선택 사항)
         */
        private String name;

        /**
         * 수정할 기수 또는 코호트 (선택 사항)
         */
        private String season;

        /**
         * 수정할 전화번호 (선택 사항)
         */
        private String phone;
    }

    /**
     * 참여자 응답 데이터를 위한 DTO.
     * 모든 참여자 정보 및 관련 프로필을 포함합니다.
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {

        /**
         * 참여자의 고유 식별자
         */
        private String id;

        /**
         * 참여자의 이름
         */
        private String name;

        /**
         * 참여자의 기수 또는 코호트
         */
        private String season;

        /**
         * 참여자의 전화번호
         */
        private String phone;

        /**
         * 관련 프로필 정보
         */
        private ProfileDto.Response profile;

        /**
         * 참여자가 생성된 타임스탬프
         */
        private LocalDateTime createdAt;

        /**
         * 참여자가 마지막으로 수정된 타임스탬프
         */
        private LocalDateTime updatedAt;

        /**
         * Participant 엔티티를 Response DTO로 변환합니다.
         *
         * @param participant 참여자 엔티티
         * @return 응답 DTO
         */
        public static Response from(Participant participant) {
            return Response.builder()
                    .id(participant.getId())
                    .name(participant.getName())
                    .season(participant.getSeason())
                    .phone(participant.getPhone())
                    .profile(participant.getProfile() != null ?
                            ProfileDto.Response.from(participant.getProfile()) : null)
                    .createdAt(participant.getCreatedAt())
                    .updatedAt(participant.getUpdatedAt())
                    .build();
        }
    }
}
