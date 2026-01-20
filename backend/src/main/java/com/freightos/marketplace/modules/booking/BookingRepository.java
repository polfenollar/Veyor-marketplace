package com.freightos.marketplace.modules.booking;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    java.util.List<Booking> findByContactEmail(String contactEmail);

    java.util.List<Booking> findByContactEmailIgnoreCase(String contactEmail);

    java.util.List<Booking> findByUserId(Long userId);
}
