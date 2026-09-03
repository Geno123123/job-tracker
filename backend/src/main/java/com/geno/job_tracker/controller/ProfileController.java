package com.geno.job_tracker.controller;

import com.geno.job_tracker.dto.ProfileRequest;
import com.geno.job_tracker.dto.ProfileResponse;
import com.geno.job_tracker.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.getMyProfile(email));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> saveOrUpdate(
            Authentication authentication,
            @Valid @RequestBody ProfileRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.saveOrUpdate(email, request));
    }
}