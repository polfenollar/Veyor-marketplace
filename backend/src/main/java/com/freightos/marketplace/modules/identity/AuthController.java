package com.freightos.marketplace.modules.identity;

import com.freightos.marketplace.modules.identity.User;
import com.freightos.marketplace.modules.identity.Organization;
import com.freightos.marketplace.modules.identity.UserRepository;
import com.freightos.marketplace.modules.identity.OrganizationRepository;
import com.freightos.marketplace.modules.identity.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final OrganizationRepository organizationRepository;

    public AuthController(UserRepository userRepository, JwtUtil jwtUtil,
            OrganizationRepository organizationRepository) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.organizationRepository = organizationRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String role = request.getOrDefault("role", "BUYER");
        String orgName = request.get("organizationName");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        Long orgId = null;
        if (orgName != null && !orgName.isEmpty()) {
            // Check if organization with this name already exists
            Optional<Organization> existingOrg = organizationRepository.findByName(orgName);
            if (existingOrg.isPresent()) {
                // Reuse existing organization
                orgId = existingOrg.get().getId();
            } else {
                // Create new organization
                Organization org = new Organization();
                org.setName(orgName);
                org.setAdminEmail(email);
                organizationRepository.save(org);
                orgId = org.getId();
            }
        }

        User user = new User(email, password, role, orgId); // In real app, hash password!
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token, "user", user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) { // In real app, check hash!
                String token = jwtUtil.generateToken(user);
                return ResponseEntity.ok(Map.of("token", token, "user", user));
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
