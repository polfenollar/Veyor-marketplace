package com.veyor.marketplace.modules.quoting;

import com.veyor.marketplace.modules.quoting.grpc.QuoteResponse;
import com.veyor.marketplace.modules.quoting.grpc.Quote;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuotingServiceClient quotingClient;

    public QuoteController(QuotingServiceClient quotingClient) {
        this.quotingClient = quotingClient;
    }

    @PostMapping("/search")
    public ResponseEntity<List<QuoteDTO>> searchQuotes(@RequestBody QuoteSearchRequest request) {
        QuoteResponse response = quotingClient.getQuotes(
                request.getOrigin(),
                request.getDestination(),
                request.getReadyDate(),
                request.getEquipment(),
                request.getWeight(),
                request.getCommodity(),
                null // Transaction ID auto-generated
        );

        List<QuoteDTO> dtos = response.getQuotesList().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private QuoteDTO mapToDTO(Quote quote) {
        QuoteDTO dto = new QuoteDTO();
        dto.setQuoteId(quote.getQuoteId());
        dto.setCarrierName(quote.getCarrierName());
        dto.setTotalPrice(quote.getTotalPrice());
        dto.setCurrency(quote.getCurrency());
        dto.setTransitTimeDays(quote.getTransitTimeDays());
        dto.setValidUntil(quote.getValidUntil());
        return dto;
    }
}
