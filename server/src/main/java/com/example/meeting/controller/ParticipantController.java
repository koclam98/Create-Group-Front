package com.example.meeting.controller;

import com.example.meeting.dto.ParticipantDto;
import com.example.meeting.service.ParticipantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/participants")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;

    @GetMapping
    public ResponseEntity<List<ParticipantDto.Response>> findAll() {
        return ResponseEntity.ok(participantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParticipantDto.Response> findById(@PathVariable("id") String id) {
        return ResponseEntity.ok(participantService.findById(id));
    }

    @PostMapping
    public ResponseEntity<ParticipantDto.Response> create(@Valid @RequestBody ParticipantDto.Create dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(participantService.create(dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ParticipantDto.Response> update(
            @PathVariable("id") String id,
            @RequestBody ParticipantDto.Update dto) {
        return ResponseEntity.ok(participantService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") String id) {
        participantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
