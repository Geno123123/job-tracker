package com.geno.job_tracker.domain;

public enum ApplicationStatus {
    DOCUMENT,        // 서류
    APTITUDE_TEST,   // 인적성 / NCS 필기
    CODING_TEST,     // 코딩테스트
    INTERVIEW_1,     // 1차 면접
    INTERVIEW_2,     // 2차 면접
    PASSED,          // 합격
    FAILED           // 불합격
}