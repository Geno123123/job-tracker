package com.geno.job_tracker.repository;

import com.geno.job_tracker.domain.Application;
import com.geno.job_tracker.domain.CoverLetter;
import com.geno.job_tracker.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoverLetterRepository extends JpaRepository<CoverLetter, Long> {
    List<CoverLetter> findByUser(User user);
    List<CoverLetter> findByApplication(Application application);
    List<CoverLetter> findByUserAndQuestionContaining(User user, String keyword);
}