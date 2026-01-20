package com.freightos.marketplace.modules.catalog;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

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

        List<Tariff> tariffs = tariffRepository.findAll();

        // Filter by origin if provided
        if (origin != null && !origin.isEmpty()) {
            tariffs = tariffs.stream()
                    .filter(t -> t.getOriginPort().equalsIgnoreCase(origin))
                    .toList();
        }

        // Filter by destination if provided
        if (destination != null && !destination.isEmpty()) {
            tariffs = tariffs.stream()
                    .filter(t -> t.getDestinationPort().equalsIgnoreCase(destination))
                    .toList();
        }

        return tariffs.stream().map(this::toDto).toList();
    }

    // Crear tarifa – sólo carrier o admin
    @PostMapping
    @PreAuthorize("hasAnyRole('carrier','admin')")
    public TariffDto createTariff(@RequestBody CreateOrUpdateTariffRequest request) {
        Tariff tariff = new Tariff(
                request.mode,
                request.originPort,
                request.destinationPort,
                request.price,
                request.currency,
                LocalDate.parse(request.validFrom),
                LocalDate.parse(request.validTo),
                request.transitTimeDays,
                request.carrierName);
        Tariff saved = tariffRepository.save(tariff);
        return toDto(saved);
    }

    // Actualizar tarifa
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('carrier','admin')")
    public TariffDto updateTariff(@PathVariable Long id,
            @RequestBody CreateOrUpdateTariffRequest request) {
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
