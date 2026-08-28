package com.geno.job_tracker.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cover_letters")
@Getter
@NoArgsConstructor
public class CoverLetter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(nullable = false, length = 500)
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private Integer charLimit;

    @Builder
    public CoverLetter(User user, Application application, String question,
                       String content, Integer charLimit) {
        this.user = user;
        this.application = application;
        this.question = question;
        this.content = content;
        this.charLimit = charLimit;
    }

    public void update(String question, String content, Integer charLimit) {
        this.question = question;
        this.content = content;
        this.charLimit = charLimit;
    }

    public int getCharCount() {
        return content == null ? 0 : content.length();
    }
}