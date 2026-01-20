package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment-methods")
public class PaymentController {

    private final PaymentMethodRepository paymentMethodRepository;

    public PaymentController(PaymentMethodRepository paymentMethodRepository) {
        this.paymentMethodRepository = paymentMethodRepository;
    }

    @GetMapping
    public ResponseEntity<List<PaymentMethod>> getPaymentMethods(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user) {
        if (user == null)
            return ResponseEntity.status(401).build();
        return ResponseEntity.ok(paymentMethodRepository.findByUserId(user.getEmail()));
    }

    @PostMapping
    public ResponseEntity<PaymentMethod> addPaymentMethod(
            @org.springframework.security.core.annotation.AuthenticationPrincipal User user,
            @RequestBody PaymentMethod paymentMethod) {
        if (user == null)
            return ResponseEntity.status(401).build();

        paymentMethod.setUserId(user.getEmail());
        if (paymentMethod.getToken() == null) {
            paymentMethod.setToken("tok_" + System.currentTimeMillis());
        }

        // If it's the first method, make it default
        List<PaymentMethod> existing = paymentMethodRepository.findByUserId(user.getEmail());
        if (existing.isEmpty()) {
            paymentMethod.setDefault(true);
        }

        return ResponseEntity.ok(paymentMethodRepository.save(paymentMethod));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentMethod(@PathVariable Long id) {
        paymentMethodRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
