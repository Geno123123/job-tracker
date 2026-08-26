package com.geno.job_tracker.repository;

import com.geno.job_tracker.domain.Application;
import com.geno.job_tracker.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUser(User user);  //내 지원 현황 목록 전체 조회
}