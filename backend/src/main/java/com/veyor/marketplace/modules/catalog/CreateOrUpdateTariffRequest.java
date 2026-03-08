package com.veyor.marketplace.modules.catalog;

import java.math.BigDecimal;

public class CreateOrUpdateTariffRequest {
    public String mode;
    public String originPort;
    public String destinationPort;
    public BigDecimal price;
    public String currency;
    public String validFrom; // "2025-01-01"
    public String validTo;
    public Integer transitTimeDays;
    public String carrierName;
}
