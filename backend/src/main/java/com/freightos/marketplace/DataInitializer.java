package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;
import com.freightos.marketplace.modules.identity.UserRepository;
import com.freightos.marketplace.modules.identity.Organization;
import com.freightos.marketplace.modules.identity.OrganizationRepository;
import com.freightos.marketplace.modules.booking.Booking;
import com.freightos.marketplace.modules.booking.BookingRepository;
import com.freightos.marketplace.modules.booking.Shipment;
import com.freightos.marketplace.modules.catalog.Tariff;
import com.freightos.marketplace.modules.catalog.TariffRepository;
import com.freightos.marketplace.modules.catalog.CommodityTemplateRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;

@Component
@ConditionalOnProperty(name = "app.data-initializer.enabled", havingValue = "true", matchIfMissing = true)
public class DataInitializer implements CommandLineRunner {

    private final TariffRepository tariffRepository;
    private final ShipmentRepository shipmentRepository;
    private final TrackingEventRepository trackingEventRepository;
    private final ShipmentDocumentRepository shipmentDocumentRepository;
    private final ShipmentTaskRepository shipmentTaskRepository;
    private final NotificationRepository notificationRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final CommodityTemplateRepository commodityTemplateRepository;
    private final ReferralRepository referralRepository;
    private final CreditRepository creditRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public DataInitializer(TariffRepository tariffRepository, ShipmentRepository shipmentRepository,
            TrackingEventRepository trackingEventRepository, ShipmentDocumentRepository shipmentDocumentRepository,
            ShipmentTaskRepository shipmentTaskRepository, NotificationRepository notificationRepository,
            CompanyProfileRepository companyProfileRepository, CommodityTemplateRepository commodityTemplateRepository,
            ReferralRepository referralRepository, CreditRepository creditRepository,
            OrganizationRepository organizationRepository, UserRepository userRepository,
            BookingRepository bookingRepository) {
        this.tariffRepository = tariffRepository;
        this.shipmentRepository = shipmentRepository;
        this.trackingEventRepository = trackingEventRepository;
        this.shipmentDocumentRepository = shipmentDocumentRepository;
        this.shipmentTaskRepository = shipmentTaskRepository;
        this.notificationRepository = notificationRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.commodityTemplateRepository = commodityTemplateRepository;
        this.referralRepository = referralRepository;
        this.creditRepository = creditRepository;
        this.organizationRepository = organizationRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Organization
        Organization organization = null;
        if (organizationRepository.count() == 0) {
            organization = new Organization();
            organization.setName("Buyer Corp");
            organization.setAdminEmail("buyer@example.com");
            organization.setStatus("ACTIVE");
            organization = organizationRepository.save(organization);
            System.out.println("Seeded Organization: Buyer Corp");
        } else {
            // If exists, try to find it (assuming single org for now or find by name)
            // For simplicity in this fix, we'll just grab the first one or create if needed
            // logic could be more complex
            // But since count != 0, we'll just fetch all and take first
            List<Organization> orgs = organizationRepository.findAll();
            if (!orgs.isEmpty()) {
                organization = orgs.get(0);
            }
        }

        // Seed Admin Users with different roles
        // 1. SUPER_ADMIN
        if (userRepository.findByEmail("admin@freightos.com").isEmpty()) {
            User admin = new User("admin@freightos.com", "admin123", "SUPER_ADMIN", null);
            userRepository.save(admin);
            System.out.println("Seeded SUPER_ADMIN User: admin@freightos.com / admin123");
        } else {
            // Migrate existing ADMIN to SUPER_ADMIN
            User admin = userRepository.findByEmail("admin@freightos.com").get();
            if ("ADMIN".equals(admin.getRole())) {
                admin.setRole("SUPER_ADMIN");
                userRepository.save(admin);
                System.out.println("Migrated admin@freightos.com from ADMIN to SUPER_ADMIN");
            }
        }

        // 2. FINANCE_MANAGER
        if (userRepository.findByEmail("finance@freightos.com").isEmpty()) {
            User financeManager = new User("finance@freightos.com", "finance123", "FINANCE_MANAGER", null);
            userRepository.save(financeManager);
            System.out.println("Seeded FINANCE_MANAGER User: finance@freightos.com / finance123");
        }

        // 3. SUPPORT_AGENT
        if (userRepository.findByEmail("support@freightos.com").isEmpty()) {
            User supportAgent = new User("support@freightos.com", "support123", "SUPPORT_AGENT", null);
            userRepository.save(supportAgent);
            System.out.println("Seeded SUPPORT_AGENT User: support@freightos.com / support123");
        }

        // Seed Buyer User
        if (userRepository.findByEmail("buyer@example.com").isEmpty()) {
            Long orgId = (organization != null) ? organization.getId() : null;
            User buyer = new User("buyer@example.com", "buyer123", "BUYER", orgId);
            userRepository.save(buyer);
            System.out.println("Seeded Buyer User: buyer@example.com / buyer123");
        } else {
            // Update existing buyer with org if missing
            User buyer = userRepository.findByEmail("buyer@example.com").get();
            if (buyer.getOrganizationId() == null && organization != null) {
                buyer.setOrganizationId(organization.getId());
                userRepository.save(buyer);
                System.out.println("Updated Buyer User with Organization ID");
            }
        }

        // Seed Test User 1@1.com (for development/testing)
        if (userRepository.findByEmail("1@1.com").isEmpty()) {
            Long orgId = (organization != null) ? organization.getId() : null;
            User testUser = new User("1@1.com", "1", "BUYER", orgId);
            userRepository.save(testUser);
            System.out.println("Seeded Test User: 1@1.com / 1");
        } else {
            // Update existing test user with org if missing
            User testUser = userRepository.findByEmail("1@1.com").get();
            if (testUser.getOrganizationId() == null && organization != null) {
                testUser.setOrganizationId(organization.getId());
                userRepository.save(testUser);
                System.out.println("Updated Test User 1@1.com with Organization ID");
            }
        }

        // Update all BUYER users without organization to use the seeded organization
        if (organization != null) {
            List<User> usersWithoutOrg = userRepository.findByRoleAndOrganizationIdIsNull("BUYER");
            if (!usersWithoutOrg.isEmpty()) {
                for (User user : usersWithoutOrg) {
                    user.setOrganizationId(organization.getId());
                    userRepository.save(user);
                }
                System.out.println("Updated " + usersWithoutOrg.size() + " BUYER users with organization");
            }
        }

        if (tariffRepository.count() == 0) {
            tariffRepository.saveAll(List.of(
                    new Tariff("OCEAN", "CN-SHA", "US-LAX", new BigDecimal("1200.0"), "USD", LocalDate.of(2025, 11, 1),
                            LocalDate.of(2025, 11, 30), 25, "Maersk"),
                    new Tariff("OCEAN", "CN-SHA", "US-NYC", new BigDecimal("1450.0"), "USD", LocalDate.of(2025, 11, 1),
                            LocalDate.of(2025, 11, 30), 30, "MSC"),
                    new Tariff("OCEAN", "CN-NGB", "US-LGB", new BigDecimal("1150.0"), "USD", LocalDate.of(2025, 11, 5),
                            LocalDate.of(2025, 12, 5), 24, "CMA CGM")));
            System.out.println("Seeded 3 tariffs");
        }

        // Seed Booking for Buyer
        if (bookingRepository.count() == 0) {
            User buyer = userRepository.findByEmail("buyer@example.com").orElseThrow();
            Long orgId = buyer.getOrganizationId();

            Booking booking = new Booking();
            booking.setQuoteId("Q-" + System.currentTimeMillis());
            booking.setTotalPrice(new BigDecimal("1200.00"));
            booking.setCurrency("USD");
            booking.setContactName("John Buyer");
            booking.setContactEmail("buyer@example.com");
            booking.setContactPhone("555-0123");
            booking.setCompanyName("Buyer Corp");
            booking.setOriginAddress("Shanghai Port");
            booking.setDestinationAddress("Los Angeles Port");
            booking.setGoodsDescription("Electronics");
            booking.setStatus("CONFIRMED");
            booking.setUserId(buyer.getId());
            booking.setOrganizationId(orgId);
            Booking savedBooking = bookingRepository.save(booking);
            System.out.println("Seeded Booking for buyer@example.com");

            // Seed Shipment
            Shipment shipment = new Shipment();
            shipment.setBookingId(savedBooking.getId());
            shipment.setTrackingNumber("TRK-SEED-001");
            shipment.setOrigin("Shanghai Port");
            shipment.setDestination("Los Angeles Port");
            shipment.setCarrier("Maersk");
            shipment.setMode("OCEAN");
            shipment.setEstimatedArrival(LocalDateTime.now().plusDays(20));
            shipment.setStatus("BOOKED");
            shipmentRepository.save(shipment);
            System.out.println("Seeded Shipment TRK-SEED-001");
        } else {
            // Backfill existing bookings if they have null organizationId
            User buyer = userRepository.findByEmail("buyer@example.com").orElse(null);
            if (buyer != null && buyer.getOrganizationId() != null) {
                List<Booking> bookings = bookingRepository.findAll();
                boolean updated = false;
                for (Booking b : bookings) {
                    if (b.getOrganizationId() == null) {
                        b.setOrganizationId(buyer.getOrganizationId());
                        if (b.getUserId() == null) {
                            b.setUserId(buyer.getId());
                        }
                        bookingRepository.save(b);
                        updated = true;
                    }
                }
                if (updated) {
                    System.out.println("Backfilled Organization ID for existing bookings");
                }
            }
        }
    }
}
