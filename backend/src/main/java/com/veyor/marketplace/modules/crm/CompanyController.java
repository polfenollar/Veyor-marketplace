package com.veyor.marketplace.modules.crm;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyProfileRepository companyProfileRepository;

    public CompanyController(CompanyProfileRepository companyProfileRepository) {
        this.companyProfileRepository = companyProfileRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<CompanyProfile> getProfile(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return companyProfileRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profile")
    public ResponseEntity<CompanyProfile> updateProfile(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId,
            @RequestBody CompanyProfile profile) {
        return companyProfileRepository.findByUserId(userId)
                .map(existing -> {
                    existing.setCompanyName(profile.getCompanyName());
                    existing.setTaxId(profile.getTaxId());
                    existing.setAddress(profile.getAddress());
                    existing.setBusinessLicenseNumber(profile.getBusinessLicenseNumber());
                    existing.setRegistrationDate(profile.getRegistrationDate());
                    existing.setContactPerson(profile.getContactPerson());
                    return ResponseEntity.ok(companyProfileRepository.save(existing));
                })
                .orElseGet(() -> {
                    profile.setUserId(userId);
                    return ResponseEntity.ok(companyProfileRepository.save(profile));
                });
    }

    @PostMapping("/kyc")
    public ResponseEntity<CompanyProfile> uploadKyc(
            @RequestHeader(value = "X-User-Id", defaultValue = "1") Long userId) {
        return companyProfileRepository.findByUserId(userId)
                .map(profile -> {
                    profile.setKycStatus("VERIFIED"); // Mock verification
                    return ResponseEntity.ok(companyProfileRepository.save(profile));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
