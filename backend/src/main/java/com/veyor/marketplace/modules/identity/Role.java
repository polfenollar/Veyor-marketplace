package com.veyor.marketplace.modules.identity;

import jakarta.persistence.*;

/**
 * Role entity for RBAC system.
 * Defines predefined roles with associated permissions.
 */
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    /**
     * Predefined system roles
     */
    public enum RoleType {
        SUPER_ADMIN("Full system access"),
        SUPPORT_AGENT("Booking and shipment oversight"),
        FINANCE_MANAGER("Financial management and reporting"),
        BUYER("Standard user role"),
        CARRIER("Carrier role for tariff management");

        private final String description;

        RoleType(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }

    public Role() {
    }

    public Role(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Role{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
