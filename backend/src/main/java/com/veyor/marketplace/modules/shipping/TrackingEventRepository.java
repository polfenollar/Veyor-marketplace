package com.veyor.marketplace.modules.shipping;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long> {
    List<TrackingEvent> findByShipmentIdOrderByTimestampDesc(Long shipmentId);
}
