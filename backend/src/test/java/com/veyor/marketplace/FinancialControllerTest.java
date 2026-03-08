package com.veyor.marketplace;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class FinancialControllerTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private InvoiceRepository invoiceRepository;

    @InjectMocks
    private FinancialController financialController;

    @Test
    public void testGetFinancialStats() {
        // Arrange
        Transaction t1 = new Transaction();
        t1.setType("PAYMENT");
        t1.setStatus("SUCCESS");
        t1.setAmount(new BigDecimal("100.00"));

        Transaction t2 = new Transaction();
        t2.setType("PAYMENT");
        t2.setStatus("SUCCESS");
        t2.setAmount(new BigDecimal("50.00"));

        Transaction t3 = new Transaction();
        t3.setType("REFUND"); // Should be ignored for revenue
        t3.setStatus("SUCCESS");
        t3.setAmount(new BigDecimal("20.00"));

        when(transactionRepository.findAll()).thenReturn(Arrays.asList(t1, t2, t3));

        // Act
        Map<String, Object> stats = financialController.getFinancialStats();

        // Assert
        assertEquals(new BigDecimal("150.00"), stats.get("totalRevenue"));
        assertEquals(3L, stats.get("transactionCount"));
        assertEquals("USD", stats.get("currency"));
    }

    @Test
    public void testGetAllTransactions() {
        // Arrange
        Transaction t1 = new Transaction();
        when(transactionRepository.findAll()).thenReturn(Arrays.asList(t1));

        // Act
        List<Transaction> result = financialController.getAllTransactions();

        // Assert
        assertEquals(1, result.size());
    }
}
