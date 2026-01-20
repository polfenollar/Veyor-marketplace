package com.freightos.marketplace.modules.catalog;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommodityTemplateRepository extends JpaRepository<CommodityTemplate, Long> {
    List<CommodityTemplate> findByUserId(String userId);
}
