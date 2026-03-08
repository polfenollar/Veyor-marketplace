package com.veyor.marketplace.modules.finance;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByOrganizationId(Long organizationId);

    List<Invoice> findByBookingId(Long bookingId);
}
