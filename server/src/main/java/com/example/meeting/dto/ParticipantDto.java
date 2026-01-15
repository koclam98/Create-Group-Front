package com.example.meeting.dto;

import com.example.meeting.domain.Participant;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

public class ParticipantDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        @NotBlank(message = "이름은 필수입니다")
        private String name;

        @NotBlank(message = "기수는 필수입니다")
        private String season;

        @NotBlank(message = "연락처는 필수입니다")
        private String phone;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {
        private String name;
        private String season;
        private String phone;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String name;
        private String season;
        private String phone;
        private ProfileDto.Response profile;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

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
