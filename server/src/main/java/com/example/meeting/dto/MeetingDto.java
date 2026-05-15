package com.example.meeting.dto;

import com.example.meeting.domain.Meeting;
import com.example.meeting.domain.Participant;

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

    public record Create(
        @NotBlank(message = "제목은 필수입니다.") String title,
        @NotBlank(message = "설명은 필수입니다.") String desc,
        @NotNull(message = "일시는 필수입니다.") String date,
        @NotBlank(message = "장소는 필수입니다.") String location,
        List<String> paricipantIds
    ) {}

    public record Update(
        String title,
        String desc,
        String date,
        String location,
        List<String> participantIds
    ) {}

    public record Response(
        String id,
        String title,
        String desc,
        LocalDateTime date,
        String locaion,
        List<ParticipantDto.Response> participants,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {
        public static Response from(Meeting meeting) {
            return new Response(meeting.getId()
                , meeting.getTitle()
                , meeting.getDesc()
                , meeting.getDate()
                , meeting.getLocation()
                , meeting.getParticipants().stream()
                    .map(ParticipantDto.Response::from)
                    .toList()
                , meeting.getCreatedAt()
                , meeting.getUpdatedAt()
            );
        }
    }

}
