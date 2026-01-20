package com.freightos.marketplace;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByOrganizationId(Long organizationId);

    List<Transaction> findByBookingId(Long bookingId);
}
