'use client';

import React, { useState } from 'react';
import { ArrowLeft, Ship, Package, MapPin, Calendar, AlertTriangle, Route as RouteIcon, CheckCircle } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { DEMO_ALERTS, ALTERNATIVE_ROUTES, AlternativeRoute } from '@/data/demoAlertsData';

export default function AlertDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [showRoutesModal, setShowRoutesModal] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<AlternativeRoute | null>(null);

    const alert = DEMO_ALERTS.find(a => a.id === params.id);
    const alternativeRoutes = alert ? ALTERNATIVE_ROUTES[alert.id] || [] : [];

    if (!alert) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <p className="text-gray-500">Alert not found</p>
                    <Link href="/admin/freighty-agent" className="text-blue-600 hover:underline mt-4 inline-block">
                        Back to Alerts
                    </Link>
                </div>
            </div>
        );
    }

    const handleRouteSelection = (route: AlternativeRoute) => {
        if (route.carrierName === "Santa Clause Logistics") {
            setSelectedRoute(route);
            setShowRoutesModal(false);
            setShowSuccessPopup(true);

            // Auto-dismiss after 3 seconds
            setTimeout(() => {
                setShowSuccessPopup(false);
            }, 3000);
        }
    };

    const vesselfinderUrl = alert.vesselMMSI
        ? `https://www.vesselfinder.com/aismap?mmsi=${alert.vesselMMSI}&zoom=2`
        : `https://www.vesselfinder.com`;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <Link
                    href="/admin/freighty-agent"
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Alerts
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Shipment Alert Details</h1>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Shipment Details */}
                <div className="space-y-6">
                    {/* Alert Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <h2 className="text-lg font-semibold text-gray-800">Alert Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Booking ID</label>
                                <div className="text-sm font-mono text-gray-900">{alert.bookingId}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Issue</label>
                                <div className="text-sm text-gray-900">{alert.issue}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Severity</label>
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                        alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {alert.severity}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipment Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Package className="w-5 h-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-800">Shipment Details</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Origin</label>
                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {alert.origin}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">Destination</label>
                                    <div className="text-sm text-gray-900 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {alert.destination}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Container Type</label>
                                <div className="text-sm text-gray-900">{alert.containerType}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Goods</label>
                                <div className="text-sm text-gray-900">{alert.goods}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Container Number</label>
                                <div className="text-sm font-mono text-gray-900">{alert.containerNumber}</div>
                            </div>
                        </div>
                    </div>

                    {/* Vessel Details Card */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Ship className="w-5 h-5 text-purple-600" />
                            <h2 className="text-lg font-semibold text-gray-800">Vessel Information</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Vessel Name</label>
                                <div className="text-sm font-semibold text-gray-900">{alert.vesselName}</div>
                            </div>
                            {alert.vesselMMSI && (
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-semibold">MMSI</label>
                                    <div className="text-sm font-mono text-gray-900">{alert.vesselMMSI}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => setShowRoutesModal(true)}
                        disabled={alternativeRoutes.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RouteIcon className="w-5 h-5" />
                        View Alternative Routes
                    </button>
                </div>

                {/* Right Column - Vessel Map */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h2 className="text-lg font-semibold text-gray-800">Live Vessel Tracking</h2>
                    </div>
                    <div className="relative w-full" style={{ height: '600px' }}>
                        <iframe
                            src={vesselfinderUrl}
                            className="w-full h-full rounded-lg border border-gray-300"
                            title="Vessel Tracker"
                            allow="geolocation"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Real-time vessel position provided by VesselFinder.com
                    </p>
                </div>
            </div>

            {/* Alternative Routes Modal */}
            {showRoutesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Alternative Shipping Routes</h2>
                            <p className="text-sm text-gray-600 mt-1">Select an alternative carrier to recover from the delay</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="space-y-3">
                                {alternativeRoutes.map(route => (
                                    <button
                                        key={route.id}
                                        onClick={() => handleRouteSelection(route)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all hover:shadow-md ${route.carrierName === "Santa Clause Logistics"
                                            ? 'border-green-500 bg-green-50 hover:bg-green-100'
                                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900 flex items-center gap-2 mb-1">
                                                    {route.carrierName}
                                                    {route.carrierName === "Santa Clause Logistics" && (
                                                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">RECOMMENDED</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">{route.serviceType}</div>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-1 text-gray-700">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>ETA: {new Date(route.eta).toLocaleDateString()}</span>
                                                    </div>
                                                    {route.cost && (
                                                        <div className="font-semibold text-gray-900">
                                                            ${route.cost.toLocaleString()} {route.currency}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <RouteIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={() => setShowRoutesModal(false)}
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center animate-bounce-in">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delay Recovered!</h3>
                        <p className="text-gray-600 mb-1">
                            Successfully rerouted via <span className="font-semibold text-green-600">Santa Clause Logistics</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Your shipment will arrive on time
                        </p>
                        <button
                            onClick={() => setShowSuccessPopup(false)}
                            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg"
                        >
                            Great!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
