package com.veyor.marketplace.modules.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByBookingIdIn(List<Long> bookingIds);

    Optional<Shipment> findByTrackingNumber(String trackingNumber);
}
