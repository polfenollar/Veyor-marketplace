package com.veyor.marketplace.modules.quoting;

public class QuoteDTO {
    private String quoteId;
    private String carrierName;
    private double totalPrice;
    private String currency;
    private int transitTimeDays;
    private String validUntil;

    // Getters and Setters
    public String getQuoteId() {
        return quoteId;
    }

    public void setQuoteId(String quoteId) {
        this.quoteId = quoteId;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public int getTransitTimeDays() {
        return transitTimeDays;
    }

    public void setTransitTimeDays(int transitTimeDays) {
        this.transitTimeDays = transitTimeDays;
    }

    public String getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(String validUntil) {
        this.validUntil = validUntil;
    }
}
