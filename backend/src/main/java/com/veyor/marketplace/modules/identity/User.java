package com.veyor.marketplace.modules.identity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // BUYER, ADMIN

    private Long organizationId;

    @Column(nullable = false)
    private String status = "ACTIVE"; // ACTIVE, BLOCKED

    public User() {
    }

    public User(String email, String password, String role, Long organizationId) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.organizationId = organizationId;
        this.status = "ACTIVE";
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("organizationId")
    public Long getOrganizationId() {
        return organizationId;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("organizationId")
    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * Check if user has a specific role
     */
    public boolean hasRole(String roleName) {
        return this.role != null && this.role.equalsIgnoreCase(roleName);
    }

    /**
     * Check if user has any of the specified roles
     */
    public boolean hasAnyRole(String... roleNames) {
        if (this.role == null) {
            return false;
        }
        for (String roleName : roleNames) {
            if (this.role.equalsIgnoreCase(roleName)) {
                return true;
            }
        }
        return false;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                ", organizationId=" + organizationId +
                ", status='" + status + '\'' +
                '}';
    }
}
