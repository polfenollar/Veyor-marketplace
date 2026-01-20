package com.freightos.marketplace;

import com.freightos.marketplace.modules.booking.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    java.util.List<Shipment> findByBookingIdIn(java.util.List<Long> bookingIds);
}
