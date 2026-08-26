package com.geno.job_tracker.service;

import com.geno.job_tracker.domain.Application;
import com.geno.job_tracker.domain.ApplicationStatus;
import com.geno.job_tracker.domain.Company;
import com.geno.job_tracker.domain.User;
import com.geno.job_tracker.dto.ApplicationCreateRequest;
import com.geno.job_tracker.dto.ApplicationResponse;
import com.geno.job_tracker.repository.ApplicationRepository;
import com.geno.job_tracker.repository.CompanyRepository;
import com.geno.job_tracker.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;

    public Long create(String email, ApplicationCreateRequest request) {
        User user = getUser(email);
        Company company = findOrCreateCompany(request.companyName());

        Application application = Application.builder()
                .user(user)
                .company(company)
                .position(request.position())
                .status(ApplicationStatus.DOCUMENT)
                .deadline(request.deadline())
                .build();

        return applicationRepository.save(application).getId();
    }

    public List<ApplicationResponse> getMyApplications(String email) {
        User user = getUser(email);
        return applicationRepository.findByUser(user).stream()
                .map(ApplicationResponse::from)
                .toList();
    }

    public void updateStatus(String email, Long applicationId, ApplicationStatus status) {
        Application application = getOwnedApplication(email, applicationId);
        application.updateStatus(status);
    }

    public void delete(String email, Long applicationId) {
        Application application = getOwnedApplication(email, applicationId);
        applicationRepository.delete(application);
    }

    private Application getOwnedApplication(String email, Long applicationId) {
        User user = getUser(email);
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지원 건입니다."));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 지원 건만 수정/삭제할 수 있습니다.");
        }
        return application;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }

    private Company findOrCreateCompany(String name) {
        return companyRepository.findByName(name)
                .orElseGet(() -> companyRepository.save(Company.builder().name(name).build()));
    }
}