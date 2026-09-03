package com.geno.job_tracker.controller;

import com.geno.job_tracker.dto.CoverLetterRequest;
import com.geno.job_tracker.dto.CoverLetterResponse;
import com.geno.job_tracker.service.CoverLetterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cover-letters")
@RequiredArgsConstructor
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    @GetMapping
    public ResponseEntity<List<CoverLetterResponse>> getMyCoverLetters(
            Authentication authentication,
            @RequestParam(required = false) String keyword
    ) {
        String email = (String) authentication.getPrincipal();

        if (keyword != null && !keyword.isBlank()) {
            return ResponseEntity.ok(coverLetterService.searchByQuestion(email, keyword));
        }
        return ResponseEntity.ok(coverLetterService.getMyCoverLetters(email));
    }

    @PostMapping
    public ResponseEntity<Long> create(
            Authentication authentication,
            @Valid @RequestBody CoverLetterRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(coverLetterService.create(email, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CoverLetterRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        coverLetterService.update(email, id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        String email = (String) authentication.getPrincipal();
        coverLetterService.delete(email, id);
        return ResponseEntity.noContent().build();
    }
}