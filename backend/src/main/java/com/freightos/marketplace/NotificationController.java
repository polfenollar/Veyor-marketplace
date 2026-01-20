package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        String userId = "current_user"; // Mock user
        seedMockDataIfEmpty(userId);
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true);
                    return ResponseEntity.ok(notificationRepository.save(notification));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void seedMockDataIfEmpty(String userId) {
        if (notificationRepository.count() == 0) {
            Notification n1 = new Notification();
            n1.setUserId(userId);
            n1.setTitle("Shipment Booked");
            n1.setMessage("Your shipment TRK-123456 has been successfully booked.");
            n1.setType("SUCCESS");
            notificationRepository.save(n1);

            Notification n2 = new Notification();
            n2.setUserId(userId);
            n2.setTitle("Action Required");
            n2.setMessage("Please upload the commercial invoice for shipment TRK-123456.");
            n2.setType("WARNING");
            notificationRepository.save(n2);

            Notification n3 = new Notification();
            n3.setUserId(userId);
            n3.setTitle("New Feature");
            n3.setMessage("Check out our new Analytics dashboard!");
            n3.setType("INFO");
            n3.setRead(true);
            notificationRepository.save(n3);
        }
    }
}
