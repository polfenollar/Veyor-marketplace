package com.veyor.marketplace;

import com.veyor.marketplace.modules.content.Notification;
import com.veyor.marketplace.modules.content.NotificationRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    public NotificationListener(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Async
    @EventListener
    public void handleNotification(NotificationEvent event) {
        // Simulate email sending
        System.out.println("Sending email to user " + event.getUserId() + ": " + event.getTitle());

        // Save notification to DB
        Notification n = new Notification();
        n.setUserId(event.getUserId());
        n.setTitle(event.getTitle());
        n.setMessage(event.getMessage());
        n.setType(event.getType());
        n.setRead(false);
        notificationRepository.save(n);
    }
}
