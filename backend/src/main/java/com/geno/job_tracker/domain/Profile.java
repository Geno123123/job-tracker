package com.geno.job_tracker.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "profiles")
@Getter
@NoArgsConstructor
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String phone;
    private String school;
    private String major;
    private String studentId;

    @Column(length = 500)
    private String introduction;

    private String desiredPosition;

    @Builder
    public Profile(User user, String phone, String school, String major,
                   String studentId, String introduction, String desiredPosition) {
        this.user = user;
        this.phone = phone;
        this.school = school;
        this.major = major;
        this.studentId = studentId;
        this.introduction = introduction;
        this.desiredPosition = desiredPosition;
    }

    public void update(String phone, String school, String major,
                       String studentId, String introduction, String desiredPosition) {
        this.phone = phone;
        this.school = school;
        this.major = major;
        this.studentId = studentId;
        this.introduction = introduction;
        this.desiredPosition = desiredPosition;
    }
}