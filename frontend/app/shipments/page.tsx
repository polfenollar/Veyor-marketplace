'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface Shipment {
    id: number;
    trackingNumber: string;
    status: string;
    origin: string;
    destination: string;
    carrier: string;
    mode: string;
    estimatedArrival: string;
}

export default function ShipmentsPage() {
    const router = useRouter();
    const { token, user } = useAuth();
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token && user) {
            fetchShipments();
        } else {
            setLoading(false);
        }
    }, [token, user]);

    const fetchShipments = async () => {
        try {
            // Fetch user-specific shipments via bookings
            const res = await fetch(`${API_BASE}/api/shipments`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setShipments(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'IN_TRANSIT': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Shipments</h1>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
                    >
                        New Shipment
                    </button>
                </div>

                {loading ? (
                    <div>Loading...</div>
                ) : shipments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <Package className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">No shipments yet</h3>
                        <p className="text-gray-500 mb-6">Book your first shipment to see it here.</p>
                        <button
                            onClick={() => router.push('/')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Start a Quote
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {shipments.map(shipment => (
                            <div
                                key={shipment.id}
                                onClick={() => router.push(`/shipments/${shipment.id}`)}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-800">{shipment.trackingNumber}</div>
                                            <div className="text-xs text-gray-500 uppercase">{shipment.carrier} • {shipment.mode}</div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase self-start md:self-center ${getStatusColor(shipment.status)}`}>
                                        {shipment.status.replace('_', ' ')}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Origin</div>
                                            <div className="text-sm text-gray-800">{shipment.origin}</div>
                                        </div>
                                    </div>

                                    <div className="hidden md:flex items-center justify-center text-gray-300">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Destination</div>
                                            <div className="text-sm text-gray-800">{shipment.destination}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>Est. Arrival: <span className="font-medium text-gray-800">{new Date(shipment.estimatedArrival).toLocaleDateString()}</span></span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
