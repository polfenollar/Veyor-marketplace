package com.veyor.marketplace.modules.catalog;

import java.math.BigDecimal;

public class TariffDto {

    public Long id;
    public String mode;
    public String originPort;
    public String destinationPort;
    public BigDecimal price;
    public String currency;
    public String validFrom; // ISO date string
    public String validTo; // ISO date string
    public Integer transitTimeDays;
    public String carrierName;
}
