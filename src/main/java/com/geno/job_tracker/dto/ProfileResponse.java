package com.geno.job_tracker.dto;

import com.geno.job_tracker.domain.Profile;

public record ProfileResponse(
        Long id,
        String phone,
        String school,
        String major,
        String studentId,
        String introduction,
        String desiredPosition
) {
    public static ProfileResponse from(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                 profile.getPhone(),
                profile.getSchool(),
                profile.getMajor(),
                profile.getStudentId(),
                profile.getIntroduction(),
                profile.getDesiredPosition()
        );
    }
}