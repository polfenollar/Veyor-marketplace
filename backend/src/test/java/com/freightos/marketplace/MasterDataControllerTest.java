package com.freightos.marketplace;

import com.freightos.marketplace.modules.catalog.Commodity;
import com.freightos.marketplace.modules.catalog.CommodityRepository;
import com.freightos.marketplace.modules.catalog.Location;
import com.freightos.marketplace.modules.catalog.LocationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MasterDataControllerTest {

    @Mock
    private LocationRepository locationRepository;

    @Mock
    private CommodityRepository commodityRepository;

    @InjectMocks
    private MasterDataController masterDataController;

    // --- Locations Tests ---

    @Test
    public void testGetAllLocations() {
        // Arrange
        Location l1 = new Location("US-LAX", "Los Angeles", "PORT", "USA");
        Location l2 = new Location("CN-SHA", "Shanghai", "PORT", "China");
        when(locationRepository.findAll()).thenReturn(Arrays.asList(l1, l2));

        // Act
        List<Location> result = masterDataController.getAllLocations();

        // Assert
        assertEquals(2, result.size());
    }

    @Test
    public void testCreateLocation() {
        // Arrange
        Location newLoc = new Location("US-JFK", "JFK Airport", "AIRPORT", "USA");
        when(locationRepository.save(any(Location.class))).thenReturn(newLoc);

        // Act
        Location result = masterDataController.createLocation(newLoc);

        // Assert
        assertEquals("US-JFK", result.getCode());
        verify(locationRepository, times(1)).save(newLoc);
    }

    @Test
    public void testDeleteLocation() {
        // Arrange
        Long id = 1L;
        doNothing().when(locationRepository).deleteById(id);

        // Act
        ResponseEntity<Void> response = masterDataController.deleteLocation(id);

        // Assert
        assertEquals(204, response.getStatusCode().value());
        verify(locationRepository, times(1)).deleteById(id);
    }

    // --- Commodities Tests ---

    @Test
    public void testGetAllCommodities() {
        // Arrange
        Commodity c1 = new Commodity("Electronics", "Gadgets", false);
        when(commodityRepository.findAll()).thenReturn(Arrays.asList(c1));

        // Act
        List<Commodity> result = masterDataController.getAllCommodities();

        // Assert
        assertEquals(1, result.size());
    }

    @Test
    public void testCreateCommodity() {
        // Arrange
        Commodity newCom = new Commodity("Chemicals", "Hazardous", true);
        when(commodityRepository.save(any(Commodity.class))).thenReturn(newCom);

        // Act
        Commodity result = masterDataController.createCommodity(newCom);

        // Assert
        assertEquals("Chemicals", result.getName());
        verify(commodityRepository, times(1)).save(newCom);
    }

    @Test
    public void testDeleteCommodity() {
        // Arrange
        Long id = 1L;
        doNothing().when(commodityRepository).deleteById(id);

        // Act
        ResponseEntity<Void> response = masterDataController.deleteCommodity(id);

        // Assert
        assertEquals(204, response.getStatusCode().value());
        verify(commodityRepository, times(1)).deleteById(id);
    }
}
