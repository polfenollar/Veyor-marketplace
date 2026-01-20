package com.freightos.marketplace;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentDocumentRepository extends JpaRepository<ShipmentDocument, Long> {
    List<ShipmentDocument> findByShipmentId(Long shipmentId);
}
