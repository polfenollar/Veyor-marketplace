package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByReferrerIdOrderByCreatedAtDesc(String referrerId);
}
