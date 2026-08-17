package com.geno.job_tracker.dto;

public record LoginResponse(String accessToken,
                            String email,
                            String name) {}
