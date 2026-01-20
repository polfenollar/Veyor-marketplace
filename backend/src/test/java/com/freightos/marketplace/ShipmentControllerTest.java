package com.freightos.marketplace;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import com.freightos.marketplace.modules.booking.Booking;
import com.freightos.marketplace.modules.booking.Shipment;
import com.freightos.marketplace.modules.booking.BookingRepository;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class ShipmentControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private ShipmentRepository shipmentRepository;

        @MockBean
        private TrackingEventRepository trackingEventRepository;

        @MockBean
        private ShipmentDocumentRepository shipmentDocumentRepository;

        @MockBean
        private ShipmentTaskRepository shipmentTaskRepository;

        @MockBean
        private BookingRepository bookingRepository;

        @Test
        @WithMockUser(username = "admin", roles = { "ADMIN" })
        public void getUserShipments_ShouldReturnShipments_WhenUserHasBookings() throws Exception {
                String email = "test@example.com";
                Booking booking = new Booking();
                booking.setId(1L);
                booking.setContactEmail(email);

                Shipment shipment = new Shipment();
                shipment.setId(100L);
                shipment.setBookingId(1L);
                shipment.setTrackingNumber("TRK-123");

                when(bookingRepository.findByContactEmailIgnoreCase(eq(email)))
                                .thenReturn(Collections.singletonList(booking));
                when(shipmentRepository.findByBookingIdIn(anyList()))
                                .thenReturn(Collections.singletonList(shipment));

                mockMvc.perform(get("/api/shipments/user/" + email)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].id").value(100))
                                .andExpect(jsonPath("$[0].trackingNumber").value("TRK-123"));
        }

        @Test
        @WithMockUser(username = "admin", roles = { "ADMIN" })
        public void getUserShipments_ShouldReturnEmpty_WhenUserHasNoBookings() throws Exception {
                String email = "empty@example.com";
                when(bookingRepository.findByContactEmailIgnoreCase(eq(email)))
                                .thenReturn(Collections.emptyList());

                mockMvc.perform(get("/api/shipments/user/" + email)
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.length()").value(0));
        }
}
