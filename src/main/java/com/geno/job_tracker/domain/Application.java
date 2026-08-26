package com.geno.job_tracker.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "applications")
@Getter
@NoArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String position;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status;

    private LocalDate deadline;

    @Builder
    public Application(User user, Company company, String position, ApplicationStatus status, LocalDate deadline) {
        this.user = user;
        this.company = company;
        this.position = position;
        this.status = status;
        this.deadline = deadline;
    }

    public void updateStatus(ApplicationStatus status) {
        this.status = status;
    }
}