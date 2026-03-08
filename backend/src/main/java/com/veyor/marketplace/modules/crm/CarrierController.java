package com.veyor.marketplace.modules.crm;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class CarrierController {

    @GetMapping("/api/carrier/ping")
    @PreAuthorize("hasRole('carrier')")
    public Map<String, String> carrierPing() {
        return Map.of("status", "carrier-ok");
    }
}
