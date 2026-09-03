package com.geno.job_tracker.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignUpRequest( //새롭게 나온 record Java 16~
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다") String password,
        @NotBlank String name
) {}