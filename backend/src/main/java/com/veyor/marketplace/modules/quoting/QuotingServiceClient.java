package com.veyor.marketplace.modules.quoting;

import com.veyor.marketplace.modules.quoting.grpc.QuotingServiceGrpc;
import com.veyor.marketplace.modules.quoting.grpc.QuoteRequest;
import com.veyor.marketplace.modules.quoting.grpc.QuoteResponse;
import com.veyor.marketplace.modules.quoting.grpc.CargoDetails;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.UUID;

@Service
public class QuotingServiceClient {

    @Value("${quoting.service.host:localhost}")
    private String host;

    @Value("${quoting.service.port:50051}")
    private int port;

    private QuotingServiceGrpc.QuotingServiceBlockingStub blockingStub;

    @PostConstruct
    public void init() {
        ManagedChannel channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();
        blockingStub = QuotingServiceGrpc.newBlockingStub(channel);
    }

    public QuoteResponse getQuotes(String origin, String destination, String readyDate,
            String equipment, double weight, String commodity, String transactionId) {

        CargoDetails cargo = CargoDetails.newBuilder()
                .setEquipmentType(equipment)
                .setTotalWeightKg(weight)
                .setCommodityType(commodity)
                .build();

        QuoteRequest request = QuoteRequest.newBuilder()
                .setTransactionId(transactionId != null ? transactionId : UUID.randomUUID().toString())
                .setOriginLocode(origin)
                .setDestinationLocode(destination)
                .setReadyDate(readyDate)
                .setCargo(cargo)
                .setCurrencyRequested("USD") // MVP Default
                .build();

        return blockingStub.getQuotes(request);
    }
}
