package com.geno.job_tracker.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity //jpa로 관리
@Table(name = "users") //테이블과 매칭
@Getter
@NoArgsConstructor //매개변수가 없는 기본 생성자를 만들어 줌
public class User {

    @Id //PK 지정
    @GeneratedValue(strategy = GenerationType.IDENTITY) //자동 증가
    private Long id;

    @Column(nullable = false, unique = true) //컬럼 제약조건
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Builder
    public User(String email, String password, String name) {
        this.email = email;
        this.password = password;
        this.name = name;
    }
}