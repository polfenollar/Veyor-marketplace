package com.freightos.marketplace.modules.crm;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Long> {
    List<Referral> findByReferrerIdOrderByCreatedAtDesc(String referrerId);
}
