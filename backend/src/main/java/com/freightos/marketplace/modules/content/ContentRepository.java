package com.freightos.marketplace.modules.content;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContentRepository extends JpaRepository<ContentItem, Long> {
    List<ContentItem> findByStatus(String status);

    List<ContentItem> findByType(String type);
}
