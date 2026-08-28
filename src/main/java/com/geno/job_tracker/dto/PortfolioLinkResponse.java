package com.geno.job_tracker.dto;

import com.geno.job_tracker.domain.PortfolioLink;

public record PortfolioLinkResponse(
        Long id,
         String label,
         String url

) {
    public static PortfolioLinkResponse from(PortfolioLink portfolioLink){
        return new PortfolioLinkResponse(
                portfolioLink.getId(),
                portfolioLink.getLabel(),
                portfolioLink.getUrl()
        );
    }
}
