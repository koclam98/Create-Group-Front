package com.example.meeting.service;

import com.example.meeting.domain.Meeting;
import com.example.meeting.domain.Participant;
import com.example.meeting.dto.ParticipantDto;
import com.example.meeting.exception.DuplicateResourceException;
import com.example.meeting.exception.ResourceNotFoundException;
import com.example.meeting.repository.ParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    public List<ParticipantDto.Response> findAll() {
        return participantRepository.findAll().stream()
                .map(ParticipantDto.Response::from)
                .collect(Collectors.toList());
    }

    public ParticipantDto.Response findById(String id) {
        Participant participant = getParticipantById(id);
        return ParticipantDto.Response.from(participant);
    }

    @Transactional
    public ParticipantDto.Response create(ParticipantDto.Create dto) {
        validatePhoneNotDuplicate(dto.getPhone());

        Participant participant = Participant.builder()
                .name(dto.getName())
                .season(dto.getSeason())
                .phone(dto.getPhone())
                .build();

        Participant saved = participantRepository.save(participant);
        return ParticipantDto.Response.from(saved);
    }

    @Transactional
    public ParticipantDto.Response update(String id, ParticipantDto.Update dto) {
        Participant participant = getParticipantById(id);

        if (dto.getName() != null) participant.setName(dto.getName());
        if (dto.getSeason() != null) participant.setSeason(dto.getSeason());
        if (dto.getPhone() != null) participant.setPhone(dto.getPhone());

        return ParticipantDto.Response.from(participant);
    }

    @Transactional
    public void delete(String id) {
        Participant participant = getParticipantById(id);

        // 참여자가 속한 모든 모임에서 제거
        for (Meeting meeting : participant.getMeetings()) {
            meeting.getParticipants().remove(participant);
        }

        participantRepository.deleteById(id);
    }

    // Private helper methods
    private Participant getParticipantById(String id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("참여자를 찾을 수 없습니다."));
    }

    private void validatePhoneNotDuplicate(String phone) {
        if (participantRepository.existsByPhone(phone)) {
            throw new DuplicateResourceException("이미 등록된 연락처입니다.");
        }
    }
}
