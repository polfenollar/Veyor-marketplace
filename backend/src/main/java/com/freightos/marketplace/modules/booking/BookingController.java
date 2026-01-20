package com.freightos.marketplace.modules.booking;

import com.freightos.marketplace.modules.identity.User;
import com.freightos.marketplace.modules.identity.Organization;
import com.freightos.marketplace.TransactionRepository;
import com.freightos.marketplace.InvoiceRepository;
import com.freightos.marketplace.Transaction;
import com.freightos.marketplace.Invoice;
import com.freightos.marketplace.ShipmentRepository;
import com.freightos.marketplace.CreateBookingRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final ShipmentRepository shipmentRepository;
    private final TransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;

    public BookingController(BookingRepository bookingRepository, ShipmentRepository shipmentRepository,
            TransactionRepository transactionRepository, InvoiceRepository invoiceRepository) {
        this.bookingRepository = bookingRepository;
        this.shipmentRepository = shipmentRepository;
        this.transactionRepository = transactionRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @PostMapping
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<Booking> createBooking(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user,
            @RequestBody CreateBookingRequest request) {
        if (user == null)
            return ResponseEntity.status(401).build();

        Booking booking = new Booking();
        booking.setQuoteId(request.getQuoteId());
        booking.setTotalPrice(request.getTotalPrice());
        booking.setCurrency(request.getCurrency());
        booking.setContactName(request.getContactName());
        booking.setContactEmail(request.getContactEmail());
        booking.setContactPhone(request.getContactPhone());
        booking.setCompanyName(request.getCompanyName());
        booking.setOriginAddress(request.getOriginAddress());
        booking.setDestinationAddress(request.getDestinationAddress());
        booking.setGoodsDescription(request.getGoodsDescription());
        booking.setStatus("CONFIRMED"); // Auto-confirm for now

        // Link to User/Org
        booking.setUserId(user.getId());
        booking.setOrganizationId(user.getOrganizationId());

        Booking savedBooking = bookingRepository.save(booking);

        // Create Transaction
        Transaction transaction = new Transaction(
                user.getOrganizationId(),
                savedBooking.getId(),
                "PAYMENT",
                request.getTotalPrice(),
                request.getCurrency(),
                "SUCCESS",
                "tx_" + System.currentTimeMillis());
        transactionRepository.save(transaction);

        // Create Invoice
        Invoice invoice = new Invoice(
                user.getOrganizationId(),
                savedBooking.getId(),
                "INV-" + System.currentTimeMillis(),
                request.getTotalPrice(),
                request.getCurrency(),
                java.time.LocalDate.now().plusDays(30),
                "PAID");
        invoiceRepository.save(invoice);

        // Create Shipment
        Shipment shipment = new Shipment();
        shipment.setBookingId(savedBooking.getId());
        shipment.setTrackingNumber("TRK-" + System.currentTimeMillis());
        shipment.setOrigin(savedBooking.getOriginAddress());
        shipment.setDestination(savedBooking.getDestinationAddress());
        shipment.setCarrier("DHL"); // Mock carrier for now, ideally comes from quote
        shipment.setMode("AIR"); // Mock mode
        shipment.setEstimatedArrival(java.time.LocalDateTime.now().plusDays(5));
        shipmentRepository.save(shipment);

        return ResponseEntity.ok(savedBooking);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        java.util.Optional<Booking> booking = bookingRepository.findById(id);
        return booking.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<java.util.List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }
}
