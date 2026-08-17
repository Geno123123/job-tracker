package com.geno.job_tracker.service;

import com.geno.job_tracker.config.JwtTokenProvider;
import com.geno.job_tracker.domain.User;
import com.geno.job_tracker.dto.LoginRequest;
import com.geno.job_tracker.dto.LoginResponse;
import com.geno.job_tracker.dto.SignUpRequest;
import com.geno.job_tracker.dto.UserResponse;
import com.geno.job_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public Long signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .build();

        return userRepository.save(user).getId();
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다."));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        return new LoginResponse(token, user.getEmail(), user.getName());
    }


    public UserResponse getMyInfo(String email){
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
        return new UserResponse(user.getId(), user.getEmail(), user.getName());

    }
}