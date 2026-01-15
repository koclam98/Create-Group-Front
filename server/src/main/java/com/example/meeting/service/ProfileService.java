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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final ParticipantRepository participantRepository;

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

    public ProfileDto.Response findByParticipantId(String participantId) {
        Profile profile = getProfileByParticipantId(participantId);
        return ProfileDto.Response.from(profile);
    }

    @Transactional
    public ProfileDto.Response update(String participantId, ProfileDto.Update dto) {
        Profile profile = getProfileByParticipantId(participantId);

        if (dto.getImageUrl() != null) {
            profile.setImageUrl(dto.getImageUrl());
        }

        return ProfileDto.Response.from(profile);
    }

    @Transactional
    public void delete(String participantId) {
        Profile profile = getProfileByParticipantId(participantId);
        profileRepository.delete(profile);
    }

    // Private helper methods
    private Participant getParticipantById(String id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("참여자를 찾을 수 없습니다."));
    }

    private Profile getProfileByParticipantId(String participantId) {
        return profileRepository.findByParticipantId(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("프로필을 찾을 수 없습니다."));
    }
}
