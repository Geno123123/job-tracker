package com.geno.job_tracker.controller;

import com.geno.job_tracker.dto.SignUpRequest;
import com.geno.job_tracker.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    @PostMapping("/signup")
    public ResponseEntity<Long> signUp(@Valid @RequestBody SignUpRequest request){ // @RequestBody SignUpRequest request가 HTTP 요청의 Body에 들어있는 JSON을 SignUpRequest 객체로 변환, @Valid는 SignUpRequest의 유효성 검사
        Long userId = userService.signUp(request);
        return ResponseEntity.ok(userId);
    }
}
