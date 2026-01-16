package com.example.meeting.controller;

import com.example.meeting.dto.MeetingDto;
import com.example.meeting.service.MeetingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @GetMapping
    public ResponseEntity<List<MeetingDto.Response>> findAll() {
        return ResponseEntity.ok(meetingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingDto.Response> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(meetingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<MeetingDto.Response> create(@Valid @RequestBody MeetingDto.Create dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(meetingService.create(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<MeetingDto.Response> update(
            @PathVariable("id") String id,
            @RequestBody MeetingDto.Update dto) {
        return ResponseEntity.ok(meetingService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        meetingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
