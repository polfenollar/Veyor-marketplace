package com.veyor.marketplace;

public class NotificationEvent {
    private String userId;
    private String title;
    private String message;
    private String type;

    public NotificationEvent(String userId, String title, String message, String type) {
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
    }

    public String getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getType() { return type; }
}
