package com.example.meeting.controller;

import com.example.meeting.dto.ProfileDto;
import com.example.meeting.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileDto.Response> create(@RequestBody ProfileDto.Create dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.create(dto));
    }

    @GetMapping("/participant/{participantId}")
    public ResponseEntity<ProfileDto.Response> findByParticipantId(@PathVariable("participantId") String participantId) {
        return ResponseEntity.ok(profileService.findByParticipantId(participantId));
    }

    @PatchMapping("/participant/{participantId}")
    public ResponseEntity<ProfileDto.Response> update(
            @PathVariable("participantId") String participantId,
            @RequestBody ProfileDto.Update dto) {
        return ResponseEntity.ok(profileService.update(participantId, dto));
    }

    @DeleteMapping("/participant/{participantId}")
    public ResponseEntity<Void> delete(@PathVariable("participantId") String participantId) {
        profileService.delete(participantId);
        return ResponseEntity.noContent().build();
    }
}
