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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final ParticipantRepository participantRepository;

    public List<MeetingDto.Response> findAll() {
        return meetingRepository.findAll().stream()
                .map(MeetingDto.Response::from)
                .collect(Collectors.toList());
    }

    public MeetingDto.Response findById(String id) {
        Meeting meeting = getMeetingById(id);
        return MeetingDto.Response.from(meeting);
    }

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

    @Transactional
    public MeetingDto.Response update(String id, MeetingDto.Update dto) {
        Meeting meeting = getMeetingById(id);

        if (dto.getTitle() != null) meeting.setTitle(dto.getTitle());
        if (dto.getDesc() != null) meeting.setDesc(dto.getDesc());
        if (dto.getDate() != null) meeting.setDate(DateTimeUtil.parseIsoString(dto.getDate()));
        if (dto.getLocation() != null) meeting.setLocation(dto.getLocation());

        return MeetingDto.Response.from(meeting);
    }

    @Transactional
    public void delete(String id) {
        getMeetingById(id);
        meetingRepository.deleteById(id);
    }

    // Private helper methods
    private Meeting getMeetingById(String id) {
        return meetingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("모임을 찾을 수 없습니다."));
    }

    private List<Participant> getParticipantsByIds(List<String> ids) {
        if (ids == null || ids.isEmpty()) {
            return Collections.emptyList();
        }
        return participantRepository.findAllById(ids);
    }
}