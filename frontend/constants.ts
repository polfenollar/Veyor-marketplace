import { Location, Quote } from './types';

export const MOCK_LOCATIONS: Location[] = [
    { id: '1', name: 'Factory/Warehouse', type: 'warehouse', countryCode: 'CN' },
    { id: '2', name: 'Guangzhou, China', type: 'port', countryCode: 'CN' },
    { id: '3', name: 'Midlands Ltd', type: 'business', countryCode: 'US' },
    { id: '4', name: 'Thames Ditton, UK', type: 'business', countryCode: 'GB' },
    { id: '5', name: 'Moià, Spain', type: 'business', countryCode: 'ES' },
];

export const MOCK_QUOTES: Quote[] = [
    {
        id: 'q1',
        providerName: 'Hellmann',
        rating: 4.5,
        reviewCount: 204,
        price: 698.30,
        currency: 'USD',
        transitTimeDays: 2,
        minDays: 1,
        maxDays: 2,
        mode: 'air',
        tags: ['Best value', 'Top Logistics Provider'],
        route: { originCode: '510030', destinationCode: 'B23 6DA', stops: ['CAN', 'BHX'] }
    },
    {
        id: 'q2',
        providerName: 'Qatar Airways',
        rating: 4.8,
        reviewCount: 198,
        price: 850.00,
        currency: 'USD',
        transitTimeDays: 2,
        minDays: 1,
        maxDays: 2,
        mode: 'air',
        tags: ['Guaranteed capacity'],
        route: { originCode: '510030', destinationCode: 'B23 6DA', stops: ['CAN', 'BHX'] }
    },
    {
        id: 'q3',
        providerName: 'Silver Streak Logistics',
        rating: 3.5,
        reviewCount: 398,
        price: 2246.30,
        currency: 'USD',
        transitTimeDays: 18,
        minDays: 15,
        maxDays: 20,
        mode: 'ocean',
        tags: ['Quickest'],
        route: { originCode: '510030', destinationCode: 'B23 6DA', stops: ['CNCAN', 'GBFXT'] }
    },
    {
        id: 'q4',
        providerName: 'Haulable',
        rating: 4.2,
        reviewCount: 13,
        price: 489.38,
        currency: 'EUR',
        transitTimeDays: 4,
        minDays: 4,
        maxDays: 4,
        mode: 'truck',
        tags: ['Best value'],
        route: { originCode: '08180', destinationCode: 'KT7', stops: [] }
    },
    {
        id: 'q5',
        providerName: 'GEPA Logistics',
        rating: 4.9,
        reviewCount: 4,
        price: 1806.40,
        currency: 'EUR',
        transitTimeDays: 2,
        minDays: 2,
        maxDays: 2,
        mode: 'express',
        tags: ['Quickest'],
        route: { originCode: '08180', destinationCode: 'KT7', stops: [] }
    }
];
