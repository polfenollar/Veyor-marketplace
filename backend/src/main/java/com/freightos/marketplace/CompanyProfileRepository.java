package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CompanyProfileRepository extends JpaRepository<CompanyProfile, Long> {
    Optional<CompanyProfile> findByUserId(String userId);
}
