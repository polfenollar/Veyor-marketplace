package com.veyor.marketplace.modules.booking;

import com.veyor.marketplace.modules.identity.User;
import com.veyor.marketplace.ShipmentDetailDTO;
import com.veyor.marketplace.modules.shipping.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentRepository shipmentRepository;
    private final TrackingEventRepository trackingEventRepository;
    private final ShipmentDocumentRepository shipmentDocumentRepository;
    private final ShipmentTaskRepository shipmentTaskRepository;
    private final BookingRepository bookingRepository;

    public ShipmentController(ShipmentRepository shipmentRepository,
            TrackingEventRepository trackingEventRepository,
            ShipmentDocumentRepository shipmentDocumentRepository,
            ShipmentTaskRepository shipmentTaskRepository,
            BookingRepository bookingRepository) {
        this.shipmentRepository = shipmentRepository;
        this.trackingEventRepository = trackingEventRepository;
        this.shipmentDocumentRepository = shipmentDocumentRepository;
        this.shipmentTaskRepository = shipmentTaskRepository;
        this.bookingRepository = bookingRepository;
    }

    @GetMapping
    public ResponseEntity<List<Shipment>> getShipments(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        // Get bookings for this user
        List<Booking> bookings = bookingRepository.findByUserId(user.getId());
        if (bookings.isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }

        // Get shipments for these bookings
        List<Long> bookingIds = bookings.stream().map(Booking::getId).toList();
        return ResponseEntity.ok(shipmentRepository.findByBookingIdIn(bookingIds));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentDetailDTO> getShipmentDetail(@PathVariable Long id) {
        return shipmentRepository.findById(id)
                .map(shipment -> {
                    // Seed mock data if empty (for demo purposes)
                    seedMockDataIfEmpty(shipment);

                    List<TrackingEvent> events = trackingEventRepository.findByShipmentIdOrderByTimestampDesc(id);
                    List<ShipmentDocument> documents = shipmentDocumentRepository.findByShipmentId(id);
                    List<ShipmentTask> tasks = shipmentTaskRepository.findByShipmentId(id);
                    return ResponseEntity.ok(new ShipmentDetailDTO(shipment, events, documents, tasks));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/tasks/{taskId}")
    public ResponseEntity<ShipmentTask> updateTask(@PathVariable Long id, @PathVariable Long taskId,
            @RequestBody ShipmentTask taskUpdate) {
        return shipmentTaskRepository.findById(taskId)
                .map(task -> {
                    task.setStatus(taskUpdate.getStatus());
                    return ResponseEntity.ok(shipmentTaskRepository.save(task));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<Shipment>> getUserShipments(@PathVariable String email) {
        // First try to find by email (legacy/robustness)
        List<Booking> bookings = bookingRepository.findByContactEmailIgnoreCase(email);

        // If no bookings found by email, and if we had a way to look up user ID from
        // email, we could try that.
        // For now, let's stick to email as the primary key for this endpoint since it
        // takes an email.
        // However, we should ensure that when we list users in the frontend, we pass
        // the email correctly.

        if (bookings.isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        List<Long> bookingIds = bookings.stream().map(Booking::getId).toList();
        return ResponseEntity.ok(shipmentRepository.findByBookingIdIn(bookingIds));
    }

    @GetMapping("/user-id/{userId}")
    public ResponseEntity<List<Shipment>> getUserShipmentsById(@PathVariable Long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        if (bookings.isEmpty()) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        List<Long> bookingIds = bookings.stream().map(Booking::getId).toList();
        return ResponseEntity.ok(shipmentRepository.findByBookingIdIn(bookingIds));
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<ShipmentDetailDTO> getShipmentByTrackingNumber(@PathVariable String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber)
                .map(shipment -> {
                    // Seed mock data if empty (for demo purposes)
                    seedMockDataIfEmpty(shipment);

                    List<TrackingEvent> events = trackingEventRepository
                            .findByShipmentIdOrderByTimestampDesc(shipment.getId());
                    List<ShipmentDocument> documents = shipmentDocumentRepository.findByShipmentId(shipment.getId());
                    List<ShipmentTask> tasks = shipmentTaskRepository.findByShipmentId(shipment.getId());
                    return ResponseEntity.ok(new ShipmentDetailDTO(shipment, events, documents, tasks));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Shipment> updateShipmentStatus(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> statusUpdate) {
        return shipmentRepository.findById(id)
                .map(shipment -> {
                    if (statusUpdate.containsKey("status")) {
                        shipment.setStatus(statusUpdate.get("status"));
                        return ResponseEntity.ok(shipmentRepository.save(shipment));
                    }
                    return ResponseEntity.badRequest().<Shipment>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void seedMockDataIfEmpty(Shipment shipment) {
        if (trackingEventRepository.findByShipmentIdOrderByTimestampDesc(shipment.getId()).isEmpty()) {
            // Add "Booked" event
            TrackingEvent booked = new TrackingEvent();
            booked.setShipmentId(shipment.getId());
            booked.setStatus("BOOKED");
            booked.setLocation(shipment.getOrigin());
            booked.setDescription("Shipment has been booked.");
            booked.setTimestamp(shipment.getCreatedAt());
            trackingEventRepository.save(booked);

            // Add "Picked Up" event (mock)
            TrackingEvent pickedUp = new TrackingEvent();
            pickedUp.setShipmentId(shipment.getId());
            pickedUp.setStatus("PICKED_UP");
            pickedUp.setLocation(shipment.getOrigin());
            pickedUp.setDescription("Cargo picked up from origin.");
            pickedUp.setTimestamp(shipment.getCreatedAt().plusHours(4));
            trackingEventRepository.save(pickedUp);

            // Add Mock Document
            ShipmentDocument label = new ShipmentDocument();
            label.setShipmentId(shipment.getId());
            label.setType("LABEL");
            label.setName("Shipping Label.pdf");
            label.setUrl("#"); // Mock URL
            label.setUploadedAt(java.time.LocalDateTime.now());
            shipmentDocumentRepository.save(label);

            // Add Mock Tasks
            ShipmentTask task1 = new ShipmentTask();
            task1.setShipmentId(shipment.getId());
            task1.setTitle("Upload Commercial Invoice");
            task1.setDescription("Please upload the commercial invoice for customs clearance.");
            task1.setStatus("PENDING");
            task1.setDueDate(java.time.LocalDate.now().plusDays(2));
            shipmentTaskRepository.save(task1);

            ShipmentTask task2 = new ShipmentTask();
            task2.setShipmentId(shipment.getId());
            task2.setTitle("Approve Proof of Delivery");
            task2.setDescription("Review and approve the POD.");
            task2.setStatus("PENDING");
            task2.setDueDate(java.time.LocalDate.now().plusDays(5));
            shipmentTaskRepository.save(task2);
        }
    }
}
