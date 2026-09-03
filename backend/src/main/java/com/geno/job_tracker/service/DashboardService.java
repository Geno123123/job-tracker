package com.geno.job_tracker.service;

import com.geno.job_tracker.domain.Application;
import com.geno.job_tracker.domain.ApplicationStatus;
import com.geno.job_tracker.domain.User;
import com.geno.job_tracker.dto.DashboardResponse;
import com.geno.job_tracker.repository.ApplicationRepository;
import com.geno.job_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public DashboardResponse getDashboard(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

        List<Application> applications = applicationRepository.findByUser(user);

        Map<ApplicationStatus, Long> countByStatus = new EnumMap<>(ApplicationStatus.class);
        for (ApplicationStatus status : ApplicationStatus.values()) {
            countByStatus.put(status, 0L);
        }
        for (Application application : applications) {
            countByStatus.merge(application.getStatus(), 1L, Long::sum);
        }

        LocalDate today = LocalDate.now();
        long upcomingDeadlines = applicationRepository
                .findByUserAndDeadlineBetween(user, today, today.plusDays(7))
                .size();

        long passedDocument = applications.stream()
                .filter(a -> a.getStatus() != ApplicationStatus.DOCUMENT
                        && a.getStatus() != ApplicationStatus.FAILED)
                .count();

        double documentPassRate = applications.isEmpty()
                ? 0.0
                : Math.round((double) passedDocument / applications.size() * 1000) / 10.0;

        return new DashboardResponse(
                applications.size(),
                countByStatus,
                upcomingDeadlines,
                documentPassRate
        );
    }
}