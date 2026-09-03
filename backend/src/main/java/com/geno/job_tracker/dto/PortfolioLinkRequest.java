package com.geno.job_tracker.dto;

import jakarta.validation.constraints.NotBlank;

public record PortfolioLinkRequest(
        @NotBlank String label,
        @NotBlank String url

        ){
}
