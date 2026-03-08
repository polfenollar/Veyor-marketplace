package com.veyor.marketplace.modules.catalog;

import com.veyor.marketplace.modules.identity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommodityTemplateRepository extends JpaRepository<CommodityTemplate, Long> {
    List<CommodityTemplate> findByUserId(String userId);
}
