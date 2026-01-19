package com.example.meeting.controller;

import com.example.meeting.dto.ProfileDto;
import com.example.meeting.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 참여자 프로필 관리를 위한 REST 컨트롤러.
 * 프로필 리소스의 CRUD 작업을 위한 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * 참여자를 위한 새로운 프로필을 생성합니다.
     *
     * @param dto 프로필 생성 데이터
     * @return 생성된 프로필
     */
    @PostMapping
    public ResponseEntity<ProfileDto.Response> create(@Valid @RequestBody ProfileDto.Create dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.create(dto));
    }

    /**
     * 참여자 ID로 프로필을 조회합니다.
     *
     * @param participantId 참여자 ID
     * @return 프로필 상세 정보
     */
    @GetMapping("/participant/{participantId}")
    public ResponseEntity<ProfileDto.Response> findByParticipantId(@PathVariable("participantId") String participantId) {
        return ResponseEntity.ok(profileService.findByParticipantId(participantId));
    }

    /**
     * 기존 프로필을 수정합니다.
     *
     * @param participantId 참여자 ID
     * @param dto 프로필 수정 데이터
     * @return 수정된 프로필
     */
    @PatchMapping("/participant/{participantId}")
    public ResponseEntity<ProfileDto.Response> update(
            @PathVariable("participantId") String participantId,
            @RequestBody ProfileDto.Update dto) {
        return ResponseEntity.ok(profileService.update(participantId, dto));
    }

    /**
     * 프로필을 삭제합니다.
     *
     * @param participantId 참여자 ID
     * @return 내용 없음 응답
     */
    @DeleteMapping("/participant/{participantId}")
    public ResponseEntity<Void> delete(@PathVariable("participantId") String participantId) {
        profileService.delete(participantId);
        return ResponseEntity.noContent().build();
    }
}
