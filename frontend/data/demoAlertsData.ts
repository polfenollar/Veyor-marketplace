export interface DemoAlert {
    id: string;
    bookingId: string;
    severity: 'info' | 'warning' | 'critical';
    origin: string;
    destination: string;
    containerType: string;
    goods: string;
    issue: string;
    timestamp: string;
    vesselName: string;
    containerNumber: string;
    vesselMMSI?: string;
}

export interface AlternativeRoute {
    id: string;
    carrierName: string;
    serviceType: string;
    eta: string;
    cost?: number;
    currency?: string;
}

export const DEMO_ALERTS: DemoAlert[] = [
    {
        id: "alert-hk-topango",
        bookingId: "BK-2024-12345",
        severity: "warning",
        origin: "Hong Kong",
        destination: "Topango, USA",
        containerType: "40' HC Container",
        goods: "Electronics",
        issue: "Vessel delay due to weather conditions - 2 days behind schedule",
        timestamp: "2024-12-10T10:30:00Z",
        vesselName: "Evergreen Ever Laurel",
        containerNumber: "EGHU1234567",
        vesselMMSI: "413924000"
    },
    {
        id: "alert-sha-lax",
        bookingId: "BK-2024-12346",
        severity: "critical",
        origin: "Shanghai",
        destination: "Los Angeles, USA",
        containerType: "20' Container",
        goods: "Automotive Parts",
        issue: "Port congestion - estimated 3 day delay",
        timestamp: "2024-12-10T08:15:00Z",
        vesselName: "MSC Gulsun",
        containerNumber: "MSCU9876543",
        vesselMMSI: "477327300"
    },
    {
        id: "alert-rtm-nyc",
        bookingId: "BK-2024-12347",
        severity: "info",
        origin: "Rotterdam",
        destination: "New York, USA",
        containerType: "40' Container",
        goods: "Machinery",
        issue: "On schedule - alternative faster route available",
        timestamp: "2024-12-10T12:45:00Z",
        vesselName: "CMA CGM Antoine De Saint Exupery",
        containerNumber: "CMAU5555555",
        vesselMMSI: "228361600"
    },
    {
        id: "alert-dubai-london",
        bookingId: "BK-2024-12348",
        severity: "warning",
        origin: "Dubai",
        destination: "London, UK",
        containerType: "20' Container",
        goods: "Textiles",
        issue: "Customs clearance delay - documentation pending",
        timestamp: "2024-12-09T16:20:00Z",
        vesselName: "Maersk Tokyo",
        containerNumber: "MAEU4567890",
        vesselMMSI: "219018000"
    },
    {
        id: "alert-mumbai-hamburg",
        bookingId: "BK-2024-12349",
        severity: "critical",
        origin: "Mumbai",
        destination: "Hamburg, Germany",
        containerType: "40' HC Container",
        goods: "Chemicals",
        issue: "Vessel mechanical issue - 4 days delay expected",
        timestamp: "2024-12-09T09:00:00Z",
        vesselName: "MSC Tessa",
        containerNumber: "MSCU7777777",
        vesselMMSI: "355906000"
    }
];

export const ALTERNATIVE_ROUTES: Record<string, AlternativeRoute[]> = {
    "alert-hk-topango": [
        {
            id: "route-1",
            carrierName: "Maersk Line",
            serviceType: "Express Ocean Freight",
            eta: "2024-12-20",
            cost: 4500,
            currency: "USD"
        },
        {
            id: "route-2",
            carrierName: "Santa Clause Logistics",
            serviceType: "Premium Air-Sea Combination",
            eta: "2024-12-18",
            cost: 6200,
            currency: "USD"
        },
        {
            id: "route-3",
            carrierName: "DHL Global Forwarding",
            serviceType: "Standard Forwarding",
            eta: "2024-12-22",
            cost: 5100,
            currency: "USD"
        },
        {
            id: "route-4",
            carrierName: "CMA CGM",
            serviceType: "Economy Ocean Freight",
            eta: "2024-12-25",
            cost: 3800,
            currency: "USD"
        }
    ],
    "alert-sha-lax": [
        {
            id: "route-5",
            carrierName: "COSCO Shipping",
            serviceType: "Express Service",
            eta: "2024-12-19",
            cost: 5200,
            currency: "USD"
        },
        {
            id: "route-6",
            carrierName: "Santa Clause Logistics",
            serviceType: "Air Freight Express",
            eta: "2024-12-17",
            cost: 8500,
            currency: "USD"
        }
    ],
    "alert-rtm-nyc": [
        {
            id: "route-7",
            carrierName: "Hapag-Lloyd",
            serviceType: "Fast Track Service",
            eta: "2024-12-16",
            cost: 4200,
            currency: "USD"
        },
        {
            id: "route-8",
            carrierName: "Santa Clause Logistics",
            serviceType: "Premium Express",
            eta: "2024-12-15",
            cost: 6800,
            currency: "USD"
        }
    ]
};
