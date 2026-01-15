package com.example.meeting.dto;

import com.example.meeting.domain.Profile;
import lombok.*;

public class ProfileDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        private String imageUrl;
        private String participantId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {
        private String imageUrl;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String imageUrl;
        private String participantId;

        public static Response from(Profile profile) {
            return Response.builder()
                    .id(profile.getId())
                    .imageUrl(profile.getImageUrl())
                    .participantId(profile.getParticipant().getId())
                    .build();
        }
    }
}
