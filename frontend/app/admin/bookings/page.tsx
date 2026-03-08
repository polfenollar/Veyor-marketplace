'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, Edit2, XCircle } from 'lucide-react';
import { UserShipmentsModal } from '@/components/UserShipmentsModal';

interface Booking {
    id: number;
    quoteId: string;
    status: string;
    totalPrice: number;
    currency: string;
    contactName: string;
    contactEmail: string;
    companyName: string;
    originAddress: string;
    destinationAddress: string;
    createdAt: string;
    userId?: number;
    organizationId?: number;
}

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    useEffect(() => {
        if (token) {
            fetchBookings();
        }
    }, [token]);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8">Loading bookings...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                            <th className="p-4">ID</th>
                            <th className="p-4">User / Org</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Route</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-600">#{booking.id}</td>
                                <td className="p-4">
                                    <div className="text-sm font-medium text-slate-800">User: {booking.userId || 'N/A'}</div>
                                    <div className="text-xs text-slate-500">Org: {booking.organizationId || 'N/A'}</div>
                                </td>
                                <td className="p-4">
                                    <div className="font-medium text-slate-800">{booking.contactName}</div>
                                    <div className="text-xs text-slate-500">{booking.contactEmail}</div>
                                    <div className="text-xs text-slate-500">{booking.companyName}</div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-800">{booking.originAddress}</div>
                                    <div className="text-xs text-slate-400">to</div>
                                    <div className="text-sm text-slate-800">{booking.destinationAddress}</div>
                                </td>
                                <td className="p-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'CONFIRMED'
                                            ? 'bg-green-100 text-green-700'
                                            : booking.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-slate-800">
                                    {booking.currency} {booking.totalPrice?.toLocaleString()}
                                </td>
                                <td className="p-4 text-slate-500 text-sm">
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedUserId(booking.userId || null)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Shipment Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                            title="Edit Booking"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Cancel Booking"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {bookings.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-slate-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {selectedUserId && (
                <UserShipmentsModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                />
            )}
        </div>
    );
}
