package com.geno.job_tracker.service;

import com.geno.job_tracker.domain.PortfolioLink;
import com.geno.job_tracker.domain.User;
import com.geno.job_tracker.dto.PortfolioLinkRequest;
import com.geno.job_tracker.dto.PortfolioLinkResponse;
import com.geno.job_tracker.repository.PortfolioLinkRepository;
import com.geno.job_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PortfolioLinkService {

    private final PortfolioLinkRepository portfolioLinkRepository;
    private final UserRepository userRepository;

    public List<PortfolioLinkResponse> getMyLinks(String email) {
        User user = getUser(email);
        return portfolioLinkRepository.findByUser(user).stream()
                .map(PortfolioLinkResponse::from)
                .toList();
    }

    @Transactional
    public Long create(String email, PortfolioLinkRequest request) {
        User user = getUser(email);
        PortfolioLink link = PortfolioLink.builder()
                .user(user)
                .label(request.label())
                .url(request.url())
                .build();
        return portfolioLinkRepository.save(link).getId();
    }

    @Transactional
    public void update(String email, Long linkId, PortfolioLinkRequest request) {
        PortfolioLink link = getOwnedLink(email, linkId);
        link.update(request.label(), request.url());
    }

    @Transactional
    public void delete(String email, Long linkId) {
        PortfolioLink link = getOwnedLink(email, linkId);
        portfolioLinkRepository.delete(link);
    }

    private PortfolioLink getOwnedLink(String email, Long linkId) {
        User user = getUser(email);
        PortfolioLink link = portfolioLinkRepository.findById(linkId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 링크입니다."));

        if (!link.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("본인의 링크만 수정/삭제할 수 있습니다.");
        }
        return link;
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));
    }
}