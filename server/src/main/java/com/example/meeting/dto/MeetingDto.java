package com.example.meeting.dto;

import com.example.meeting.domain.Meeting;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class MeetingDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {
        @NotBlank(message = "제목은 필수입니다")
        private String title;

        @NotBlank(message = "설명은 필수입니다")
        private String desc;

        @NotNull(message = "일시는 필수입니다")
        private String date;

        @NotBlank(message = "장소는 필수입니다")
        private String location;

        private List<String> participantIds;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {
        private String title;
        private String desc;
        private String date;  // String으로 변경
        private String location;
        private List<String> participantIds;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String title;
        private String desc;
        private LocalDateTime date;
        private String location;
        private List<ParticipantDto.Response> participants;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static Response from(Meeting meeting) {
            return Response.builder()
                    .id(meeting.getId())
                    .title(meeting.getTitle())
                    .desc(meeting.getDesc())
                    .date(meeting.getDate())
                    .location(meeting.getLocation())
                    .participants(meeting.getParticipants().stream()
                            .map(ParticipantDto.Response::from)
                            .collect(Collectors.toList()))
                    .createdAt(meeting.getCreatedAt())
                    .updatedAt(meeting.getUpdatedAt())
                    .build();
        }
    }
}
