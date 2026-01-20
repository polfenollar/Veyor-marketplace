export interface Location {
  id: string;
  name: string;
  type: 'business' | 'port' | 'airport' | 'warehouse';
  countryCode: string;
}

export interface Quote {
  id: string;
  providerName: string;
  providerLogo?: string; // URL or placeholder logic
  rating: number;
  reviewCount: number;
  price: number;
  currency: string;
  transitTimeDays: number;
  minDays: number;
  maxDays: number;
  mode: 'air' | 'ocean' | 'truck' | 'express';
  tags: string[]; // e.g., "Best value", "Guaranteed capacity"
  route: {
    originCode: string;
    destinationCode: string;
    stops: string[];
  };
}

export type ViewState = 'HOME' | 'RECOMMENDED_SERVICES' | 'RESULTS' | 'BOOKING';

export interface ShipmentDetails {
  origin: Location;
  destination: Location;
  loadType: 'pallets' | 'containers' | 'boxes';
  quantity: number;
  totalWeight: number; // kg
  totalVolume: number; // cbm
  readyDate: string;
  goodsValue: number;
}