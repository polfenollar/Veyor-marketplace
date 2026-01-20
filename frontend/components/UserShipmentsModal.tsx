import React, { useEffect, useState } from 'react';
import { X, Package, Truck, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface UserShipmentsModalProps {
    userEmail?: string;
    userId?: number;
    onClose: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const UserShipmentsModal: React.FC<UserShipmentsModalProps> = ({ userEmail, userId, onClose }) => {
    const { token } = useAuth();
    const [shipments, setShipments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedShipment, setSelectedShipment] = useState<any>(null);

    useEffect(() => {
        if ((userEmail || userId) && token) {
            fetchShipments();
        }
    }, [userEmail, userId, token]);

    const fetchShipments = async () => {
        try {
            let url = `${API_BASE}/api/shipments/user/${userEmail}`;
            if (userId) {
                url = `${API_BASE}/api/shipments/user-id/${userId}`;
            }

            const res = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
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

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/shipments/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchShipments();
                if (selectedShipment && selectedShipment.id === id) {
                    setSelectedShipment({ ...selectedShipment, status: newStatus });
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-green-100 text-green-700';
            case 'IN_TRANSIT': return 'bg-blue-100 text-blue-700';
            case 'BOOKED': return 'bg-purple-100 text-purple-700';
            case 'CANCELLED': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'DELIVERED': return <CheckCircle className="w-4 h-4" />;
            case 'IN_TRANSIT': return <Truck className="w-4 h-4" />;
            case 'BOOKED': return <Package className="w-4 h-4" />;
            case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">User Shipments</h2>
                        <p className="text-sm text-gray-500">Shipments for {userEmail}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Shipment List */}
                    <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto p-4">
                        {loading ? (
                            <div className="text-center text-gray-500 py-8">Loading...</div>
                        ) : shipments.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">No shipments found.</div>
                        ) : (
                            <div className="space-y-3">
                                {shipments.map(shipment => (
                                    <div
                                        key={shipment.id}
                                        onClick={() => setSelectedShipment(shipment)}
                                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedShipment?.id === shipment.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-medium text-gray-900">#{shipment.id}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(shipment.status)}`}>
                                                {getStatusIcon(shipment.status)}
                                                {shipment.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                {shipment.origin}
                                            </div>
                                            <div className="h-4 border-l border-dashed border-gray-300 ml-1 my-1"></div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                {shipment.destination}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Shipment Details */}
                    <div className="w-full md:w-2/3 p-6 overflow-y-auto bg-gray-50">
                        {selectedShipment ? (
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Shipment Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-semibold">Tracking Number</label>
                                            <div className="text-gray-900 font-medium">{selectedShipment.trackingNumber || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-semibold">Carrier</label>
                                            <div className="text-gray-900 font-medium">{selectedShipment.carrier || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-semibold">Mode</label>
                                            <div className="text-gray-900 font-medium">{selectedShipment.mode || 'N/A'}</div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-semibold">Estimated Arrival</label>
                                            <div className="text-gray-900 font-medium">
                                                {selectedShipment.estimatedArrival ? new Date(selectedShipment.estimatedArrival).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                                    <div className="flex gap-3">
                                        {selectedShipment.status !== 'CANCELLED' && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to cancel this shipment?')) {
                                                        updateStatus(selectedShipment.id, 'CANCELLED');
                                                    }
                                                }}
                                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                                            >
                                                Cancel Shipment
                                            </button>
                                        )}
                                        {selectedShipment.status === 'BOOKED' && (
                                            <button
                                                onClick={() => updateStatus(selectedShipment.id, 'IN_TRANSIT')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                            >
                                                Mark as In Transit
                                            </button>
                                        )}
                                        {selectedShipment.status === 'IN_TRANSIT' && (
                                            <button
                                                onClick={() => updateStatus(selectedShipment.id, 'DELIVERED')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                                            >
                                                Mark as Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Package className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select a shipment to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
