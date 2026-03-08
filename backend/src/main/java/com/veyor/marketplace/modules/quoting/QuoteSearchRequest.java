package com.veyor.marketplace.modules.quoting;

public class QuoteSearchRequest {
    private String origin;
    private String destination;
    private String readyDate;
    private String equipment;
    private double weight;
    private String commodity;

    // Getters and Setters
    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getReadyDate() {
        return readyDate;
    }

    public void setReadyDate(String readyDate) {
        this.readyDate = readyDate;
    }

    public String getEquipment() {
        return equipment;
    }

    public void setEquipment(String equipment) {
        this.equipment = equipment;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getCommodity() {
        return commodity;
    }

    public void setCommodity(String commodity) {
        this.commodity = commodity;
    }
}
