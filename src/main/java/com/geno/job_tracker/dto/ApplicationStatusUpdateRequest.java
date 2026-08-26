package com.geno.job_tracker.dto;

import com.geno.job_tracker.domain.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record ApplicationStatusUpdateRequest(
        @NotNull ApplicationStatus status
        ){
}
