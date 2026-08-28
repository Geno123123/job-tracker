package com.geno.job_tracker.dto;

public record UserResponse(
        Long id,
        String email,
        String name
) {}