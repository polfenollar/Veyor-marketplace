package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.math.BigDecimal;

public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByUserId(String userId);
}
