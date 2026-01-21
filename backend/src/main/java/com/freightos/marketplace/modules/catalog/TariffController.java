package com.freightos.marketplace.modules.catalog;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.cache.annotation.Cacheable;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tariffs")
public class TariffController {

    private final TariffRepository tariffRepository;

    public TariffController(TariffRepository tariffRepository) {
        this.tariffRepository = tariffRepository;
    }

    // Listar tarifas – cualquier usuario autenticado (shipper, carrier, admin)
    @GetMapping
    @Cacheable("tariffs")
    public List<TariffDto> listTariffs() {
        return tariffRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    // Search tariffs with filters
    @GetMapping("/search")
    public List<TariffDto> searchTariffs(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination) {

        List<Tariff> tariffs = tariffRepository.findAll(); // Naive implementation, should use repository method

        return tariffs.stream()
                .filter(t -> (origin == null || t.getOriginPort().equalsIgnoreCase(origin)) &&
                        (destination == null || t.getDestinationPort().equalsIgnoreCase(destination)))
                .map(this::toDto)
                .toList();
    }

    // Crear tarifa – solo Carriers y Admin
    @PostMapping
    @PreAuthorize("hasAnyRole('carrier','admin')")
    public TariffDto createTariff(@RequestBody TariffDto request) {
        Tariff tariff = new Tariff();
        tariff.setMode(request.mode);
        tariff.setOriginPort(request.originPort);
        tariff.setDestinationPort(request.destinationPort);
        tariff.setPrice(request.price);
        tariff.setCurrency(request.currency);
        if (request.validFrom != null) tariff.setValidFrom(LocalDate.parse(request.validFrom));
        if (request.validTo != null) tariff.setValidTo(LocalDate.parse(request.validTo));
        tariff.setTransitTimeDays(request.transitTimeDays);
        tariff.setCarrierName(request.carrierName);

        Tariff saved = tariffRepository.save(tariff);
        return toDto(saved);
    }

    // Actualizar tarifa
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('carrier','admin')")
    public TariffDto updateTariff(@PathVariable Long id, @RequestBody TariffDto request) {
        Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tariff not found"));

        tariff.setMode(request.mode);
        tariff.setOriginPort(request.originPort);
        tariff.setDestinationPort(request.destinationPort);
        tariff.setPrice(request.price);
        tariff.setCurrency(request.currency);
        tariff.setValidFrom(LocalDate.parse(request.validFrom));
        tariff.setValidTo(LocalDate.parse(request.validTo));
        tariff.setTransitTimeDays(request.transitTimeDays);
        tariff.setCarrierName(request.carrierName);

        Tariff saved = tariffRepository.save(tariff);
        return toDto(saved);
    }

    // Borrar tarifa
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('carrier','admin')")
    public void deleteTariff(@PathVariable Long id) {
        tariffRepository.deleteById(id);
    }

    private TariffDto toDto(Tariff t) {
        TariffDto dto = new TariffDto();
        dto.id = t.getId();
        dto.mode = t.getMode();
        dto.originPort = t.getOriginPort();
        dto.destinationPort = t.getDestinationPort();
        dto.price = t.getPrice();
        dto.currency = t.getCurrency();
        dto.validFrom = t.getValidFrom() != null ? t.getValidFrom().toString() : null;
        dto.validTo = t.getValidTo() != null ? t.getValidTo().toString() : null;
        dto.transitTimeDays = t.getTransitTimeDays();
        dto.carrierName = t.getCarrierName();
        return dto;
    }
}
