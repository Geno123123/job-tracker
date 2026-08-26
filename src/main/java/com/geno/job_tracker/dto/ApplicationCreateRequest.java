package com.geno.job_tracker.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record ApplicationCreateRequest(
    @NotBlank String companyName,
    @NotBlank String position,
    LocalDate deadline
)
{}
