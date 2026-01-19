package com.example.meeting.service;

import com.example.meeting.domain.Meeting;
import com.example.meeting.domain.Participant;
import com.example.meeting.dto.MeetingDto;
import com.example.meeting.exception.ResourceNotFoundException;
import com.example.meeting.repository.MeetingRepository;
import com.example.meeting.repository.ParticipantRepository;
import com.example.meeting.util.DateTimeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 모임 비즈니스 로직 관리 서비스.
 * 모임의 CRUD 작업 및 참여자 관리를 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final ParticipantRepository participantRepository;

    /**
     * 최근 수정된 순서로 모든 모임을 조회합니다.
     *
     * @return 모든 모임 응답 DTO 목록
     */
    public List<MeetingDto.Response> findAll() {
        return meetingRepository.findAllByOrderByUpdatedAtDesc().stream()
                .map(MeetingDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * ID로 모임을 조회합니다.
     *
     * @param id 모임 ID
     * @return 모임 응답 DTO
     * @throws ResourceNotFoundException 모임을 찾을 수 없는 경우
     */
    public MeetingDto.Response findById(String id) {
        Meeting meeting = getMeetingById(id);
        return MeetingDto.Response.from(meeting);
    }

    /**
     * 참여자와 함께 새로운 모임을 생성합니다.
     *
     * @param dto 모임 생성 DTO
     * @return 생성된 모임 응답 DTO
     */
    @Transactional
    public MeetingDto.Response create(MeetingDto.Create dto) {
        List<Participant> participants = getParticipantsByIds(dto.getParticipantIds());

        Meeting meeting = Meeting.builder()
                .title(dto.getTitle())
                .desc(dto.getDesc())
                .date(DateTimeUtil.parseIsoString(dto.getDate()))
                .location(dto.getLocation())
                .participants(participants)
                .build();

        Meeting saved = meetingRepository.save(meeting);
        return MeetingDto.Response.from(saved);
    }

    /**
     * 기존 모임을 수정합니다.
     * DTO에서 null이 아닌 필드만 수정됩니다.
     * 참여자 목록이 제공되면 완전히 대체됩니다.
     *
     * @param id 모임 ID
     * @param dto 모임 수정 DTO
     * @return 수정된 모임 응답 DTO
     * @throws ResourceNotFoundException 모임을 찾을 수 없는 경우
     */
    @Transactional
    public MeetingDto.Response update(String id, MeetingDto.Update dto) {
        Meeting meeting = getMeetingById(id);

        if (dto.getTitle() != null) {
            meeting.setTitle(dto.getTitle());
        }
        if (dto.getDesc() != null) {
            meeting.setDesc(dto.getDesc());
        }
        if (dto.getDate() != null) {
            meeting.setDate(DateTimeUtil.parseIsoString(dto.getDate()));
        }
        if (dto.getLocation() != null) {
            meeting.setLocation(dto.getLocation());
        }
        if (dto.getParticipantIds() != null) {
            List<Participant> participants = getParticipantsByIds(dto.getParticipantIds());
            meeting.getParticipants().clear();
            meeting.getParticipants().addAll(participants);
        }

        Meeting savedMeeting = meetingRepository.save(meeting);
        return MeetingDto.Response.from(savedMeeting);
    }

    /**
     * 모임을 삭제합니다.
     *
     * @param id 모임 ID
     * @throws ResourceNotFoundException 모임을 찾을 수 없는 경우
     */
    @Transactional
    public void delete(String id) {
        getMeetingById(id);
        meetingRepository.deleteById(id);
    }

    /**
     * ID로 모임을 조회하거나 찾을 수 없는 경우 예외를 발생시킵니다.
     *
     * @param id 모임 ID
     * @return 모임 엔티티
     * @throws ResourceNotFoundException 모임을 찾을 수 없는 경우
     */
    private Meeting getMeetingById(String id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("모임을 찾을 수 없습니다."));
    }

    /**
     * ID로 참여자들을 조회합니다.
     *
     * @param ids 참여자 ID 목록
     * @return 참여자 엔티티 목록
     */
    private List<Participant> getParticipantsByIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        return participantRepository.findAllById(ids);
    }
}