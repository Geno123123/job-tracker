package com.geno.job_tracker.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "portfolio_links")
@Getter
@NoArgsConstructor
public class PortfolioLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) //하나의 유저가 여러 포트폴리오 링크를 가질 수 있기 때문
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false, length = 1000)
    private String url;

    @Builder
    public PortfolioLink(User user, String label, String url) {
        this.user = user;
        this.label = label;
        this.url = url;
    }

    public void update(String label, String url) {
        this.label = label;
        this.url = url;
    }
}