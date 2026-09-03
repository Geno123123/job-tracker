package com.geno.job_tracker.service;

import com.geno.job_tracker.domain.Profile;
import com.geno.job_tracker.domain.User;
import com.geno.job_tracker.dto.ProfileRequest;
import com.geno.job_tracker.dto.ProfileResponse;
import com.geno.job_tracker.repository.ProfileRepository;
import com.geno.job_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    public ProfileResponse getMyProfile(String email) {
        User user = getUser(email);
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("등록된 프로필이 없습니다."));
        return ProfileResponse.from(profile);
    }

    @Transactional
    public ProfileResponse saveOrUpdate(String email, ProfileRequest request) {
        User user = getUser(email);

        Profile profile = profileRepository.findByUser(user)
                .orElseGet(() -> profileRepository.save(
                        Profile.builder().user(user).build()
                ));

        profile.update(
                request.phone(), request.school(), request.major(),
                request.studentId(), request.introduction(), request.desiredPosition()
        );

        return ProfileResponse.from(profile);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }
}