package com.geno.job_tracker.service;

import com.geno.job_tracker.domain.Application;
import com.geno.job_tracker.domain.CoverLetter;
import com.geno.job_tracker.domain.User;
import com.geno.job_tracker.dto.CoverLetterRequest;
import com.geno.job_tracker.dto.CoverLetterResponse;
import com.geno.job_tracker.repository.ApplicationRepository;
import com.geno.job_tracker.repository.CoverLetterRepository;
import com.geno.job_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CoverLetterService {

    private final CoverLetterRepository coverLetterRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public List<CoverLetterResponse> getMyCoverLetters(String email) {
        User user = getUser(email);
        return coverLetterRepository.findByUser(user).stream()
                .map(CoverLetterResponse::from)
                .toList();
    }

    public List<CoverLetterResponse> searchByQuestion(String email, String keyword) {
        User user = getUser(email);
        return coverLetterRepository.findByUserAndQuestionContaining(user, keyword).stream()
                .map(CoverLetterResponse::from)
                .toList();
    }

    @Transactional
    public Long create(String email, CoverLetterRequest request) {
        User user = getUser(email);
        Application application = resolveApplication(user, request.applicationId());

        CoverLetter coverLetter = CoverLetter.builder()
                .user(user)
                .application(application)
                .question(request.question())
                .content(request.content())
                .charLimit(request.charLimit())
                .build();

        return coverLetterRepository.save(coverLetter).getId();
    }

    @Transactional
    public void update(String email, Long coverLetterId, CoverLetterRequest request) {
        CoverLetter coverLetter = getOwnedCoverLetter(email, coverLetterId);
        coverLetter.update(request.question(), request.content(), request.charLimit());
    }

    @Transactional
    public void delete(String email, Long coverLetterId) {
        CoverLetter coverLetter = getOwnedCoverLetter(email, coverLetterId);
        coverLetterRepository.delete(coverLetter);
    }

    private Application resolveApplication(User user, Long applicationId) {
        if (applicationId == null) {
            return null;
        }
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 지원 건입니다."));

        if (!application.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 지원 건에만 자기소개서를 연결할 수 있습니다.");
        }
        return application;
    }

    private CoverLetter getOwnedCoverLetter(String email, Long coverLetterId) {
        User user = getUser(email);
        CoverLetter coverLetter = coverLetterRepository.findById(coverLetterId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 자기소개서입니다."));

        if (!coverLetter.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 자기소개서만 수정/삭제할 수 있습니다.");
        }
        return coverLetter;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }
}