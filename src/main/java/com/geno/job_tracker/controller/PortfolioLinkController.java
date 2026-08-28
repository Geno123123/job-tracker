package com.geno.job_tracker.controller;

import com.geno.job_tracker.dto.PortfolioLinkRequest;
import com.geno.job_tracker.dto.PortfolioLinkResponse;
import com.geno.job_tracker.service.PortfolioLinkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolio-links")
@RequiredArgsConstructor
public class PortfolioLinkController {

    private final PortfolioLinkService portfolioLinkService;

    @GetMapping
    public ResponseEntity<List<PortfolioLinkResponse>> getMyLinks(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(portfolioLinkService.getMyLinks(email));
    }

    @PostMapping
    public ResponseEntity<Long> create(
            Authentication authentication,
            @Valid @RequestBody PortfolioLinkRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(portfolioLinkService.create(email, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody PortfolioLinkRequest request
    ) {
        String email = (String) authentication.getPrincipal();
        portfolioLinkService.update(email, id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        String email = (String) authentication.getPrincipal();
        portfolioLinkService.delete(email, id);
        return ResponseEntity.noContent().build();
    }
}