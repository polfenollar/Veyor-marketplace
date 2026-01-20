package com.freightos.marketplace;

import com.freightos.marketplace.modules.identity.User;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReferralController {

    private final ReferralRepository referralRepository;
    private final CreditRepository creditRepository;

    public ReferralController(ReferralRepository referralRepository, CreditRepository creditRepository) {
        this.referralRepository = referralRepository;
        this.creditRepository = creditRepository;
    }

    @GetMapping("/referrals")
    public ResponseEntity<List<Referral>> getReferrals() {
        String userId = "current_user";
        return ResponseEntity.ok(referralRepository.findByReferrerIdOrderByCreatedAtDesc(userId));
    }

    @PostMapping("/referrals/invite")
    public ResponseEntity<Referral> invite(@RequestBody Map<String, String> payload) {
        String userId = "current_user";
        String email = payload.get("email");

        Referral referral = new Referral();
        referral.setReferrerId(userId);
        referral.setRefereeEmail(email);
        return ResponseEntity.ok(referralRepository.save(referral));
    }

    @GetMapping("/credits/balance")
    public ResponseEntity<Map<String, BigDecimal>> getBalance() {
        String userId = "current_user";

        // Seed mock credit if empty
        if (creditRepository.findByUserId(userId).isEmpty()) {
            Credit credit = new Credit();
            credit.setUserId(userId);
            credit.setAmount(new BigDecimal("50.00"));
            credit.setReason("WELCOME_BONUS");
            creditRepository.save(credit);
        }

        List<Credit> credits = creditRepository.findByUserId(userId);
        BigDecimal balance = credits.stream()
                .map(Credit::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(Map.of("balance", balance));
    }
}
