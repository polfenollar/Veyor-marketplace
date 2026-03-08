package com.veyor.marketplace;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class SecureDemoController {

    @GetMapping("/api/secure-demo")
    public Map<String, Object> secureDemo(Authentication auth) {
        return Map.of(
                "principal", auth.getName(),
                "authorities", auth.getAuthorities().stream()
                        .map(a -> a.getAuthority())
                        .collect(Collectors.toList()));
    }
}
