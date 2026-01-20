package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;
import com.freightos.marketplace.modules.identity.UserRepository;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {

        @GetMapping("/api/me")
        public Map<String, Object> me(@AuthenticationPrincipal User user) {
                if (user == null) {
                        return Map.of("error", "Not authenticated");
                }
                return Map.of(
                                "principal", user.getEmail(),
                                "roles", List.of(user.getRole()),
                                "authorities", List.of("ROLE_" + user.getRole()),
                                "organizationId", user.getOrganizationId() != null ? user.getOrganizationId() : "null");
        }
}
