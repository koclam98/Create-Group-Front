package com.example.meeting.dto;

import com.example.meeting.domain.Profile;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Profile 작업을 위한 데이터 전송 객체.
 * 생성, 수정 및 응답을 위한 DTO를 포함합니다.
 */
public class ProfileDto {

    /**
     * 새로운 프로필 생성을 위한 DTO.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {

        /**
         * 프로필 이미지의 URL (선택 사항)
         */
        private String imageUrl;

        /**
         * 이 프로필이 속한 참여자의 ID (필수)
         */
        @NotBlank(message = "참여자 ID는 필수입니다")
        private String participantId;
    }

    /**
     * 기존 프로필 수정을 위한 DTO.
     * 모든 필드는 선택 사항입니다.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {

        /**
         * 수정할 프로필 이미지 URL (선택 사항)
         */
        private String imageUrl;
    }

    /**
     * 프로필 응답 데이터를 위한 DTO.
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {

        /**
         * 프로필의 고유 식별자
         */
        private String id;

        /**
         * 프로필 이미지의 URL
         */
        private String imageUrl;

        /**
         * 관련 참여자의 ID
         */
        private String participantId;

        /**
         * Profile 엔티티를 Response DTO로 변환합니다.
         *
         * @param profile 프로필 엔티티
         * @return 응답 DTO
         */
        public static Response from(Profile profile) {
            return Response.builder()
                    .id(profile.getId())
                    .imageUrl(profile.getImageUrl())
                    .participantId(profile.getParticipant().getId())
                    .build();
        }
    }
}
