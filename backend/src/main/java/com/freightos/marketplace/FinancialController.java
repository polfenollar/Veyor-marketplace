package com.freightos.marketplace;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/financials")
@PreAuthorize("hasAnyRole('SUPER_ADMIN', 'FINANCE_MANAGER')")
public class FinancialController {

    private final TransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;

    @Autowired
    public FinancialController(TransactionRepository transactionRepository, InvoiceRepository invoiceRepository) {
        this.transactionRepository = transactionRepository;
        this.invoiceRepository = invoiceRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getFinancialStats() {
        List<Transaction> allTransactions = transactionRepository.findAll();

        BigDecimal totalRevenue = allTransactions.stream()
                .filter(t -> "PAYMENT".equals(t.getType()) && "SUCCESS".equals(t.getStatus()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long transactionCount = allTransactions.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("transactionCount", transactionCount);
        stats.put("currency", "USD"); // Assuming single currency for simplicity

        return stats;
    }

    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @GetMapping("/invoices")
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }
}
