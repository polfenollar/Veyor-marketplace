package com.veyor.marketplace;

import com.veyor.marketplace.modules.identity.User;
import com.veyor.marketplace.modules.identity.UserRepository;
import com.veyor.marketplace.modules.identity.JwtUtil;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for RBAC security across different admin roles
 */
@SpringBootTest
@AutoConfigureMockMvc
public class RBACSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private String superAdminToken;
    private String financeManagerToken;
    private String supportAgentToken;
    private String buyerToken;

    @BeforeEach
    public void setup() {
        // Create test users if they don't exist
        User superAdmin = ensureTestUser("superadmin@test.com", "SUPER_ADMIN");
        User financeManager = ensureTestUser("financemanager@test.com", "FINANCE_MANAGER");
        User supportAgent = ensureTestUser("supportagent@test.com", "SUPPORT_AGENT");
        User buyer = ensureTestUser("buyer@test.com", "BUYER");

        // Generate JWT tokens for each role
        superAdminToken = "Bearer " + jwtUtil.generateToken(superAdmin);
        financeManagerToken = "Bearer " + jwtUtil.generateToken(financeManager);
        supportAgentToken = "Bearer " + jwtUtil.generateToken(supportAgent);
        buyerToken = "Bearer " + jwtUtil.generateToken(buyer);
    }

    private User ensureTestUser(String email, String role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User(email, "test123", role, null);
            return userRepository.save(user);
        });
    }

    // ========== User Management Tests ==========

    @Test
    public void testSuperAdminCanAccessUserManagement() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testFinanceManagerCannotAccessUserManagement() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testSupportAgentCannotAccessUserManagement() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", supportAgentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testBuyerCannotAccessUserManagement() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                .header("Authorization", buyerToken))
                .andExpect(status().isForbidden());
    }

    // ========== Organization Management Tests ==========

    @Test
    public void testSuperAdminCanAccessOrganizationManagement() throws Exception {
        mockMvc.perform(get("/api/admin/organizations")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testFinanceManagerCannotAccessOrganizationManagement() throws Exception {
        mockMvc.perform(get("/api/admin/organizations")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isForbidden());
    }

    // ========== Financial Management Tests ==========

    @Test
    public void testSuperAdminCanAccessFinancials() throws Exception {
        mockMvc.perform(get("/api/admin/financials/stats")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testFinanceManagerCanAccessFinancials() throws Exception {
        mockMvc.perform(get("/api/admin/financials/stats")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testSupportAgentCannotAccessFinancials() throws Exception {
        mockMvc.perform(get("/api/admin/financials/stats")
                .header("Authorization", supportAgentToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testBuyerCannotAccessFinancials() throws Exception {
        mockMvc.perform(get("/api/admin/financials/stats")
                .header("Authorization", buyerToken))
                .andExpect(status().isForbidden());
    }

    // ========== Booking Management Tests ==========

    @Test
    public void testSuperAdminCanAccessBookings() throws Exception {
        mockMvc.perform(get("/api/admin/bookings")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testSupportAgentCanAccessBookings() throws Exception {
        mockMvc.perform(get("/api/admin/bookings")
                .header("Authorization", supportAgentToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testFinanceManagerCannotAccessBookings() throws Exception {
        mockMvc.perform(get("/api/admin/bookings")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testBuyerCannotAccessBookings() throws Exception {
        mockMvc.perform(get("/api/admin/bookings")
                .header("Authorization", buyerToken))
                .andExpect(status().isForbidden());
    }

    // ========== Content Management Tests ==========

    @Test
    public void testSuperAdminCanAccessContent() throws Exception {
        mockMvc.perform(get("/api/admin/content")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testFinanceManagerCannotAccessContent() throws Exception {
        mockMvc.perform(get("/api/admin/content")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testSupportAgentCannotAccessContent() throws Exception {
        mockMvc.perform(get("/api/admin/content")
                .header("Authorization", supportAgentToken))
                .andExpect(status().isForbidden());
    }

    // ========== Master Data Tests ==========

    @Test
    public void testSuperAdminCanAccessMasterData() throws Exception {
        mockMvc.perform(get("/api/admin/master-data/locations")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testFinanceManagerCannotAccessMasterData() throws Exception {
        mockMvc.perform(get("/api/admin/master-data/locations")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    public void testSupportAgentCannotAccessMasterData() throws Exception {
        mockMvc.perform(get("/api/admin/master-data/locations")
                .header("Authorization", supportAgentToken))
                .andExpect(status().isForbidden());
    }

    // ========== Dashboard Tests ==========

    @Test
    public void testAllAdminRolesCanAccessDashboard() throws Exception {
        // SUPER_ADMIN
        mockMvc.perform(get("/api/admin/dashboard/stats")
                .header("Authorization", superAdminToken))
                .andExpect(status().isOk());

        // FINANCE_MANAGER
        mockMvc.perform(get("/api/admin/dashboard/stats")
                .header("Authorization", financeManagerToken))
                .andExpect(status().isOk());

        // SUPPORT_AGENT
        mockMvc.perform(get("/api/admin/dashboard/stats")
                .header("Authorization", supportAgentToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testBuyerCannotAccessDashboard() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard/stats")
                .header("Authorization", buyerToken))
                .andExpect(status().isForbidden());
    }

    // ========== Unauthenticated Access Tests ==========

    @Test
    public void testUnauthenticatedCannotAccessAdminEndpoints() throws Exception {
        // Spring Security returns 403 (Forbidden) for unauthenticated requests
        // when accessing protected endpoints
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/financials/stats"))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/admin/bookings"))
                .andExpect(status().isForbidden());
    }
}
