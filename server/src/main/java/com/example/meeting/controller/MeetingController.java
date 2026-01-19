package com.example.meeting.controller;

import com.example.meeting.dto.MeetingDto;
import com.example.meeting.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 모임 관리를 위한 REST 컨트롤러.
 * 모임 리소스의 CRUD 작업을 위한 엔드포인트를 제공합니다.
 */
@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    /**
     * 최근 수정된 순서로 모든 모임을 조회합니다.
     *
     * @return 모든 모임 목록
     */
    @GetMapping
    public ResponseEntity<List<MeetingDto.Response>> findAll() {
        return ResponseEntity.ok(meetingService.findAll());
    }

    /**
     * ID로 특정 모임을 조회합니다.
     *
     * @param id 모임 ID
     * @return 모임 상세 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<MeetingDto.Response> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(meetingService.findById(id));
    }

    /**
     * 새로운 모임을 생성합니다.
     *
     * @param dto 모임 생성 데이터
     * @return 생성된 모임
     */
    @PostMapping
    public ResponseEntity<MeetingDto.Response> create(@Valid @RequestBody MeetingDto.Create dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(meetingService.create(dto));
    }

    /**
     * 기존 모임을 수정합니다.
     *
     * @param id 모임 ID
     * @param dto 모임 수정 데이터
     * @return 수정된 모임
     */
    @PatchMapping("/{id}")
    public ResponseEntity<MeetingDto.Response> update(
            @PathVariable("id") String id,
            @RequestBody MeetingDto.Update dto) {
        return ResponseEntity.ok(meetingService.update(id, dto));
    }

    /**
     * 모임을 삭제합니다.
     *
     * @param id 모임 ID
     * @return 내용 없음 응답
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        meetingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
