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

/**
 * 참여자 비즈니스 로직 관리 서비스.
 * 참여자의 CRUD 작업 및 비즈니스 규칙을 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    /**
     * 모든 참여자를 조회합니다.
     *
     * @return 모든 참여자 응답 DTO 목록
     */
    public List<ParticipantDto.Response> findAll() {
        return participantRepository.findAll().stream()
                .map(ParticipantDto.Response::from)
                .collect(Collectors.toList());
    }

    /**
     * ID로 참여자를 조회합니다.
     *
     * @param id 참여자 ID
     * @return 참여자 응답 DTO
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    public ParticipantDto.Response findById(String id) {
        Participant participant = getParticipantById(id);
        return ParticipantDto.Response.from(participant);
    }

    /**
     * 새로운 참여자를 생성합니다.
     * 전화번호가 이미 등록되지 않았는지 검증합니다.
     *
     * @param dto 참여자 생성 DTO
     * @return 생성된 참여자 응답 DTO
     * @throws DuplicateResourceException 전화번호가 이미 존재하는 경우
     */
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

    /**
     * 기존 참여자를 수정합니다.
     * DTO에서 null이 아닌 필드만 수정됩니다.
     *
     * @param id 참여자 ID
     * @param dto 참여자 수정 DTO
     * @return 수정된 참여자 응답 DTO
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    @Transactional
    public ParticipantDto.Response update(String id, ParticipantDto.Update dto) {
        Participant participant = getParticipantById(id);

        if (dto.getName() != null) {
            participant.setName(dto.getName());
        }
        if (dto.getSeason() != null) {
            participant.setSeason(dto.getSeason());
        }
        if (dto.getPhone() != null) {
            participant.setPhone(dto.getPhone());
        }

        return ParticipantDto.Response.from(participant);
    }

    /**
     * 참여자를 삭제합니다.
     * 삭제하기 전에 모든 관련 모임에서 참여자를 제거합니다.
     *
     * @param id 참여자 ID
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    @Transactional
    public void delete(String id) {
        Participant participant = getParticipantById(id);

        for (Meeting meeting : participant.getMeetings()) {
            meeting.getParticipants().remove(participant);
        }

        participantRepository.deleteById(id);
    }

    /**
     * ID로 참여자를 조회하거나 찾을 수 없는 경우 예외를 발생시킵니다.
     *
     * @param id 참여자 ID
     * @return 참여자 엔티티
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    private Participant getParticipantById(String id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("참여자를 찾을 수 없습니다."));
    }

    /**
     * 전화번호가 이미 등록되지 않았는지 검증합니다.
     *
     * @param phone 검증할 전화번호
     * @throws DuplicateResourceException 전화번호가 이미 존재하는 경우
     */
    private void validatePhoneNotDuplicate(String phone) {
        if (participantRepository.existsByPhone(phone)) {
            throw new DuplicateResourceException("이미 등록된 연락처입니다.");
        }
    }
}
