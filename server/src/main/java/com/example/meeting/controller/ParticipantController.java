package com.example.meeting.controller;

import com.example.meeting.dto.ParticipantDto;
import com.example.meeting.service.ParticipantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 참여자 관리를 위한 REST 컨트롤러.
 * 참여자 리소스의 CRUD 작업을 위한 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/participants")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;

    /**
     * 모든 참여자를 조회합니다.
     *
     * @return 모든 참여자 목록
     */
    @GetMapping
    public ResponseEntity<List<ParticipantDto.Response>> findAll() {
        return ResponseEntity.ok(participantService.findAll());
    }

    /**
     * ID로 특정 참여자를 조회합니다.
     *
     * @param id 참여자 ID
     * @return 참여자 상세 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<ParticipantDto.Response> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(participantService.findById(id));
    }

    /**
     * 새로운 참여자를 생성합니다.
     *
     * @param dto 참여자 생성 데이터
     * @return 생성된 참여자
     */
    @PostMapping
    public ResponseEntity<ParticipantDto.Response> create(@Valid @RequestBody ParticipantDto.Create dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(participantService.create(dto));
    }

    /**
     * 기존 참여자를 수정합니다.
     *
     * @param id 참여자 ID
     * @param dto 참여자 수정 데이터
     * @return 수정된 참여자
     */
    @PatchMapping("/{id}")
    public ResponseEntity<ParticipantDto.Response> update(
            @PathVariable("id") String id,
            @RequestBody ParticipantDto.Update dto) {
        return ResponseEntity.ok(participantService.update(id, dto));
    }

    /**
     * 참여자를 삭제합니다.
     *
     * @param id 참여자 ID
     * @return 내용 없음 응답
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        participantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
