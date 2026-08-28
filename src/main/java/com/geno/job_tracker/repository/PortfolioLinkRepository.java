package com.geno.job_tracker.repository;

import com.geno.job_tracker.domain.PortfolioLink;
import com.geno.job_tracker.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioLinkRepository extends JpaRepository<PortfolioLink,Long> {
    List<PortfolioLink> findByUser(User user);

}
