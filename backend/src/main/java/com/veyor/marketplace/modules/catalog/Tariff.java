package com.veyor.marketplace.modules.catalog;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tariffs")
public class Tariff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String mode; // AIR / OCEAN
    private String originPort;
    private String destinationPort;
    private BigDecimal price;
    private String currency; // USD, EUR...

    private LocalDate validFrom;
    private LocalDate validTo;

    private Integer transitTimeDays;
    private String carrierName;

    public Tariff() {
    }

    public Tariff(
            String mode,
            String originPort,
            String destinationPort,
            BigDecimal price,
            String currency,
            LocalDate validFrom,
            LocalDate validTo,
            Integer transitTimeDays,
            String carrierName) {
        this.mode = mode;
        this.originPort = originPort;
        this.destinationPort = destinationPort;
        this.price = price;
        this.currency = currency;
        this.validFrom = validFrom;
        this.validTo = validTo;
        this.transitTimeDays = transitTimeDays;
        this.carrierName = carrierName;
    }

    // Getters y setters

    public Long getId() {
        return id;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getOriginPort() {
        return originPort;
    }

    public void setOriginPort(String originPort) {
        this.originPort = originPort;
    }

    public String getDestinationPort() {
        return destinationPort;
    }

    public void setDestinationPort(String destinationPort) {
        this.destinationPort = destinationPort;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidTo() {
        return validTo;
    }

    public void setValidTo(LocalDate validTo) {
        this.validTo = validTo;
    }

    public Integer getTransitTimeDays() {
        return transitTimeDays;
    }

    public void setTransitTimeDays(Integer transitTimeDays) {
        this.transitTimeDays = transitTimeDays;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }
}
