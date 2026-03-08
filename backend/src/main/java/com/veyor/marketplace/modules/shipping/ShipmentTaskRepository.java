package com.veyor.marketplace.modules.shipping;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentTaskRepository extends JpaRepository<ShipmentTask, Long> {
    List<ShipmentTask> findByShipmentId(Long shipmentId);
}
