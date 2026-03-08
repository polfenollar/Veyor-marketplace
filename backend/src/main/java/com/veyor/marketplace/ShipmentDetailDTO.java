package com.veyor.marketplace;

import com.veyor.marketplace.modules.booking.Shipment;
import com.veyor.marketplace.modules.shipping.*;
import java.util.List;

public class ShipmentDetailDTO {
    private Shipment shipment;
    private List<TrackingEvent> events;
    private List<ShipmentDocument> documents;
    private List<ShipmentTask> tasks;

    public ShipmentDetailDTO(Shipment shipment, List<TrackingEvent> events, List<ShipmentDocument> documents,
            List<ShipmentTask> tasks) {
        this.shipment = shipment;
        this.events = events;
        this.documents = documents;
        this.tasks = tasks;
    }

    // Getters
    public Shipment getShipment() {
        return shipment;
    }

    public List<TrackingEvent> getEvents() {
        return events;
    }

    public List<ShipmentDocument> getDocuments() {
        return documents;
    }

    public List<ShipmentTask> getTasks() {
        return tasks;
    }
}
