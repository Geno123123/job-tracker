package com.geno.job_tracker.dto;

import com.geno.job_tracker.domain.CoverLetter;

public record CoverLetterResponse(
        Long id,
        Long applicationId,
        String companyName,
        String question,
        String content,
        Integer charLimit,
        int charCount
) {
    public static CoverLetterResponse from(CoverLetter coverLetter) {
        return new CoverLetterResponse(
                coverLetter.getId(),
                coverLetter.getApplication() != null ? coverLetter.getApplication().getId() : null,
                coverLetter.getApplication() != null ? coverLetter.getApplication().getCompany().getName() : null,
                coverLetter.getQuestion(),
                coverLetter.getContent(),
                coverLetter.getCharLimit(),
                coverLetter.getCharCount()
        );
    }
}