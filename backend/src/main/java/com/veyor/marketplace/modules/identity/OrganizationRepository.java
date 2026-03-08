package com.veyor.marketplace.modules.identity;

import com.veyor.marketplace.modules.identity.Organization;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByName(String name);
}
