package com.example.meeting.dto;

import com.example.meeting.domain.Meeting;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Meeting 작업을 위한 데이터 전송 객체.
 * 생성, 수정 및 응답을 위한 DTO를 포함합니다.
 */
public class MeetingDto {

    /**
     * 새로운 모임 생성을 위한 DTO.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Create {

        /**
         * 모임 제목 (필수)
         */
        @NotBlank(message = "제목은 필수입니다")
        private String title;

        /**
         * 모임 설명 (필수)
         */
        @NotBlank(message = "설명은 필수입니다")
        private String desc;

        /**
         * ISO 형식의 모임 날짜 및 시간 (필수)
         */
        @NotNull(message = "일시는 필수입니다")
        private String date;

        /**
         * 모임 장소 (필수)
         */
        @NotBlank(message = "장소는 필수입니다")
        private String location;

        /**
         * 모임에 포함할 참여자 ID 목록 (선택 사항)
         */
        private List<String> participantIds;
    }

    /**
     * 기존 모임 수정을 위한 DTO.
     * 모든 필드는 선택 사항입니다.
     */
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Update {

        /**
         * 수정할 모임 제목 (선택 사항)
         */
        private String title;

        /**
         * 수정할 모임 설명 (선택 사항)
         */
        private String desc;

        /**
         * 수정할 ISO 형식의 모임 날짜 및 시간 (선택 사항)
         */
        private String date;

        /**
         * 수정할 모임 장소 (선택 사항)
         */
        private String location;

        /**
         * 수정할 참여자 ID 목록 (선택 사항, 기존 목록을 대체함)
         */
        private List<String> participantIds;
    }

    /**
     * 모임 응답 데이터를 위한 DTO.
     * 모든 모임 정보 및 관련 참여자를 포함합니다.
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {

        /**
         * 모임의 고유 식별자
         */
        private String id;

        /**
         * 모임 제목
         */
        private String title;

        /**
         * 모임 설명
         */
        private String desc;

        /**
         * 모임 날짜 및 시간
         */
        private LocalDateTime date;

        /**
         * 모임 장소
         */
        private String location;

        /**
         * 이 모임의 참여자 목록
         */
        private List<ParticipantDto.Response> participants;

        /**
         * 모임이 생성된 타임스탬프
         */
        private LocalDateTime createdAt;

        /**
         * 모임이 마지막으로 수정된 타임스탬프
         */
        private LocalDateTime updatedAt;

        /**
         * Meeting 엔티티를 Response DTO로 변환합니다.
         *
         * @param meeting 모임 엔티티
         * @return 응답 DTO
         */
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
