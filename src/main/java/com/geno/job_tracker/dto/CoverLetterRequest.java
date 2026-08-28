package com.geno.job_tracker.dto;

import jakarta.validation.constraints.NotBlank;

public record CoverLetterRequest(
        Long applicationId,
        @NotBlank String question,
        @NotBlank String content,
        Integer charLimit
) {
}
