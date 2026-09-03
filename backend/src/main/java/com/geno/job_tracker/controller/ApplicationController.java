package com.geno.job_tracker.controller;

import com.geno.job_tracker.domain.ApplicationStatus;
import com.geno.job_tracker.dto.ApplicationCreateRequest;
import com.geno.job_tracker.dto.ApplicationResponse;
import com.geno.job_tracker.dto.ApplicationStatusUpdateRequest;
import com.geno.job_tracker.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<Long> create(
            Authentication authentication,
            @Valid @RequestBody ApplicationCreateRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        Long id = applicationService.create(email, request);
        return ResponseEntity.ok(id);
    }

    @GetMapping
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(applicationService.getMyApplications(email));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        applicationService.updateStatus(email, id, request.status());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        String email = (String) authentication.getPrincipal();
        applicationService.delete(email, id);
        return ResponseEntity.noContent().build();
    }
}