package com.geno.job_tracker.dto;

import com.geno.job_tracker.domain.ApplicationStatus;

import java.util.Map;

public record DashboardResponse(
        long totalApplications,
        Map<ApplicationStatus, Long> countByStatus,
        long upcomingDeadlines,
        double documentPassRate
) {}