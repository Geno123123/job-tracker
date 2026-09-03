package com.geno.job_tracker.dto;

import com.geno.job_tracker.domain.Application;
import com.geno.job_tracker.domain.ApplicationStatus;
import java.time.LocalDate;

public record ApplicationResponse(
        Long id,
        String companyName,
        String position,
        ApplicationStatus status,
        LocalDate deadline
) {
    public static ApplicationResponse from(Application application) {
        return new ApplicationResponse(
                application.getId(),
                application.getCompany().getName(),
                application.getPosition(),
                application.getStatus(),
                application.getDeadline()
        );
    }
}