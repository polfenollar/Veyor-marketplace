package com.veyor.marketplace;

import com.veyor.marketplace.modules.identity.User;
import com.veyor.marketplace.modules.catalog.Commodity;
import com.veyor.marketplace.modules.catalog.CommodityRepository;
import com.veyor.marketplace.modules.catalog.Location;
import com.veyor.marketplace.modules.catalog.LocationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/master-data")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class MasterDataController {

    private final LocationRepository locationRepository;
    private final CommodityRepository commodityRepository;

    public MasterDataController(LocationRepository locationRepository, CommodityRepository commodityRepository) {
        this.locationRepository = locationRepository;
        this.commodityRepository = commodityRepository;
    }

    // Locations
    @GetMapping("/locations")
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @PostMapping("/locations")
    public Location createLocation(@RequestBody Location location) {
        return locationRepository.save(location);
    }

    @DeleteMapping("/locations/{id}")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Commodities
    @GetMapping("/commodities")
    public List<Commodity> getAllCommodities() {
        return commodityRepository.findAll();
    }

    @PostMapping("/commodities")
    public Commodity createCommodity(@RequestBody Commodity commodity) {
        return commodityRepository.save(commodity);
    }

    @DeleteMapping("/commodities/{id}")
    public ResponseEntity<Void> deleteCommodity(@PathVariable Long id) {
        commodityRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
