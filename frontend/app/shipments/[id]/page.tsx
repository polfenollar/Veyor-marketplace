'use client';

import React, { useEffect, useState } from 'react';
import { Package, Truck, MapPin, Calendar, FileText, CheckCircle, Circle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface TrackingEvent {
    id: number;
    status: string;
    location: string;
    description: string;
    timestamp: string;
}

interface ShipmentTask {
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
}

interface ShipmentDocument {
    id: number;
    type: string;
    name: string;
    url: string;
    uploadedAt: string;
}

interface ShipmentDetail {
    shipment: {
        id: number;
        trackingNumber: string;
        status: string;
        origin: string;
        destination: string;
        carrier: string;
        mode: string;
        estimatedArrival: string;
    };
    events: TrackingEvent[];
    documents: ShipmentDocument[];
    tasks: ShipmentTask[];
}

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { token } = useAuth();
    const { id } = React.use(params);
    const [data, setData] = useState<ShipmentDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchShipmentDetail();
        }
    }, [id, token]);

    const fetchShipmentDetail = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/shipments/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setData(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskToggle = async (taskId: number, currentStatus: string) => {
        const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';

        // Optimistic update
        if (data) {
            const updatedTasks = data.tasks.map(t =>
                t.id === taskId ? { ...t, status: newStatus } : t
            );
            setData({ ...data, tasks: updatedTasks });
        }

        try {
            await fetch(`${API_BASE}/api/shipments/${id}/tasks/${taskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (err) {
            console.error(err);
            // Revert on error would go here
        }
    };

    if (loading) return <div className="p-8 text-center">Loading shipment details...</div>;
    if (!data) return <div className="p-8 text-center">Shipment not found.</div>;

    const { shipment, events, documents, tasks } = data;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Shipments
                </button>

                {/* Header Card */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                {shipment.trackingNumber}
                                <span className="text-sm font-normal px-3 py-1 bg-blue-100 text-blue-800 rounded-full uppercase">{shipment.status.replace('_', ' ')}</span>
                            </h1>
                            <p className="text-gray-500 mt-1">Carrier: {shipment.carrier} • Mode: {shipment.mode}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Estimated Arrival</div>
                            <div className="text-lg font-bold text-gray-800">{new Date(shipment.estimatedArrival).toLocaleDateString()}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Origin</div>
                            <div className="font-medium text-gray-800">{shipment.origin}</div>
                        </div>
                        <div className="text-gray-300"><Truck className="w-5 h-5" /></div>
                        <div className="flex-1 text-right">
                            <div className="text-xs text-gray-500 uppercase font-bold mb-1">Destination</div>
                            <div className="font-medium text-gray-800">{shipment.destination}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Timeline & Tasks */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Tasks Panel */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Action Required</h2>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                {tasks && tasks.length > 0 ? (
                                    <div className="space-y-4">
                                        {tasks.map(task => (
                                            <div key={task.id} className={`flex items-start gap-3 p-3 rounded border transition-colors ${task.status === 'COMPLETED' ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'}`}>
                                                <div className="pt-1">
                                                    <button
                                                        onClick={() => handleTaskToggle(task.id, task.status)}
                                                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.status === 'COMPLETED' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 hover:border-blue-500'}`}
                                                    >
                                                        {task.status === 'COMPLETED' && <CheckCircle className="w-3 h-3" />}
                                                    </button>
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-medium ${task.status === 'COMPLETED' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{task.title}</div>
                                                    <div className="text-sm text-gray-500 mt-1">{task.description}</div>
                                                    {task.status !== 'COMPLETED' && <div className="text-xs text-red-500 mt-2 font-medium">Due: {task.dueDate}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-500 text-sm">No pending tasks.</div>
                                )}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Tracking History</h2>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="space-y-8">
                                    {events.map((event, index) => (
                                        <div key={event.id} className="relative pl-8 border-l-2 border-gray-200 last:border-0">
                                            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${index === 0 ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}></div>
                                            <div>
                                                <div className="font-bold text-gray-800">{event.status.replace('_', ' ')}</div>
                                                <div className="text-sm text-gray-600 mt-1">{event.description}</div>
                                                <div className="text-xs text-gray-400 mt-2 flex items-center gap-2">
                                                    <MapPin className="w-3 h-3" /> {event.location} • {new Date(event.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Documents</h2>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            {documents.length === 0 ? (
                                <div className="text-gray-500 text-sm">No documents available.</div>
                            ) : (
                                <div className="space-y-3">
                                    {documents.map(doc => (
                                        <a key={doc.id} href={doc.url} className="flex items-center gap-3 p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors group">
                                            <div className="w-8 h-8 bg-red-50 text-red-500 rounded flex items-center justify-center">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-sm font-medium text-gray-800 truncate group-hover:text-blue-600">{doc.name}</div>
                                                <div className="text-xs text-gray-400">{new Date(doc.uploadedAt).toLocaleDateString()}</div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
