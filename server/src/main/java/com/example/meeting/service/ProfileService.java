package com.example.meeting.service;

import com.example.meeting.domain.Participant;
import com.example.meeting.domain.Profile;
import com.example.meeting.dto.ProfileDto;
import com.example.meeting.exception.ResourceNotFoundException;
import com.example.meeting.repository.ParticipantRepository;
import com.example.meeting.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 프로필 비즈니스 로직 관리 서비스.
 * 참여자 프로필의 CRUD 작업을 처리합니다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ParticipantRepository participantRepository;

    /**
     * 참여자를 위한 새로운 프로필을 생성합니다.
     *
     * @param dto 프로필 생성 DTO
     * @return 생성된 프로필 응답 DTO
     * @throws ResourceNotFoundException 참여자를 찾을 수 없는 경우
     */
    @Transactional
    public ProfileDto.Response create(ProfileDto.Create dto) {
        Participant participant = getParticipantById(dto.getParticipantId());

        Profile profile = Profile.builder()
                .imageUrl(dto.getImageUrl())
                .participant(participant)
                .build();

        Profile saved = profileRepository.save(profile);
        return ProfileDto.Response.from(saved);
    }

    /**
     * 참여자 ID로 프로필을 조회합니다.
     *
     * @param participantId 참여자 ID
     * @return 프로필 응답 DTO
     * @throws ResourceNotFoundException 프로필을 찾을 수 없는 경우
     */
    public ProfileDto.Response findByParticipantId(String participantId) {
        Profile profile = getProfileByParticipantId(participantId);
        return ProfileDto.Response.from(profile);
    }

    /**
     * 기존 프로필을 수정합니다.
     * DTO에서 null이 아닌 필드만 수정됩니다.
     *
     * @param participantId 참여자 ID
     * @param dto 프로필 수정 DTO
     * @return 수정된 프로필 응답 DTO
     * @throws ResourceNotFoundException 프로필을 찾을 수 없는 경우
     */
    @Transactional
    public ProfileDto.Response update(String participantId, ProfileDto.Update dto) {
        Profile profile = getProfileByParticipantId(participantId);

        if (dto.getImageUrl() != null) {
            profile.setImageUrl(dto.getImageUrl());
        }

        return ProfileDto.Response.from(profile);
    }

    /**
     * 프로필을 삭제합니다.
     *
     * @param participantId 참여자 ID
     * @throws ResourceNotFoundException 프로필을 찾을 수 없는 경우
     */
    @Transactional
    public void delete(String participantId) {
        Profile profile = getProfileByParticipantId(participantId);
        profileRepository.delete(profile);
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
     * 참여자 ID로 프로필을 조회하거나 찾을 수 없는 경우 예외를 발생시킵니다.
     *
     * @param participantId 참여자 ID
     * @return 프로필 엔티티
     * @throws ResourceNotFoundException 프로필을 찾을 수 없는 경우
     */
    private Profile getProfileByParticipantId(String participantId) {
        return profileRepository.findByParticipantId(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("프로필을 찾을 수 없습니다."));
    }
}
