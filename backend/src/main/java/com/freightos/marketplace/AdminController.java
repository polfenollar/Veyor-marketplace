package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;
import com.freightos.marketplace.modules.identity.UserRepository;
import com.freightos.marketplace.modules.identity.Organization;
import com.freightos.marketplace.modules.identity.OrganizationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;

    public AdminController(OrganizationRepository organizationRepository, UserRepository userRepository) {
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User with this email already exists.");
        }
        try {
            // In a real app, password should be hashed here
            // user.setPassword(passwordEncoder.encode(user.getPassword()));
            return ResponseEntity.ok(userRepository.save(user));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEmail(userDetails.getEmail());
                    user.setRole(userDetails.getRole());
                    user.setOrganizationId(userDetails.getOrganizationId());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if ("ACTIVE".equals(user.getStatus())) {
                        user.setStatus("BLOCKED");
                    } else {
                        user.setStatus("ACTIVE");
                    }
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/password")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<User> resetPassword(@PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {
        return userRepository.findById(id)
                .map(user -> {
                    // In a real app, password should be hashed here
                    user.setPassword(payload.get("password"));
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organizations")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Organization>> getOrganizations() {
        seedMockDataIfEmpty();
        return ResponseEntity.ok(organizationRepository.findAll());
    }

    @PostMapping("/organizations")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization organization) {
        return ResponseEntity.ok(organizationRepository.save(organization));
    }

    @PutMapping("/organizations/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Organization> updateOrganization(@PathVariable Long id,
            @RequestBody Organization orgDetails) {
        return organizationRepository.findById(id)
                .map(org -> {
                    org.setName(orgDetails.getName());
                    org.setAdminEmail(orgDetails.getAdminEmail());
                    return ResponseEntity.ok(organizationRepository.save(org));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/organizations/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        organizationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/organizations/{id}/status")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Organization> toggleOrganizationStatus(@PathVariable Long id) {
        return organizationRepository.findById(id)
                .map(org -> {
                    if ("ACTIVE".equals(org.getStatus())) {
                        org.setStatus("BLOCKED");
                    } else {
                        org.setStatus("ACTIVE");
                    }
                    return ResponseEntity.ok(organizationRepository.save(org));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organizations/{id}/users")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<User>> getOrganizationUsers(@PathVariable Long id) {
        System.out.println("DEBUG: getOrganizationUsers called for orgId: " + id);
        List<User> users = userRepository.findByOrganizationId(id);
        System.out.println("DEBUG: Found " + users.size() + " users for orgId: " + id);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<java.util.Map<String, Object>> getDashboardStats() {
        // Mock stats for now
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("gmv", 1250000.00);
        stats.put("activeUsers", 1250);
        stats.put("bookingVolume", 340);
        stats.put("revenue", 45000.00);
        return ResponseEntity.ok(stats);
    }

    private void seedMockDataIfEmpty() {
        if (organizationRepository.count() == 0) {
            Organization o1 = new Organization();
            o1.setName("Acme Corp");
            o1.setAdminEmail("admin@acme.com");
            organizationRepository.save(o1);

            Organization o2 = new Organization();
            o2.setName("Global Logistics");
            o2.setAdminEmail("contact@global.com");
            organizationRepository.save(o2);
        }
    }
}
