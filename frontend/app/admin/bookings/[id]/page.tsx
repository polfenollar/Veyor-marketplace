'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Booking {
    id: number;
    quoteId: string;
    status: string;
    totalPrice: number;
    currency: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    companyName: string;
    originAddress: string;
    destinationAddress: string;
    goodsDescription: string;
    createdAt: string;
}

export default function BookingDetailPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (token && id) {
            fetchBooking();
        }
    }, [token, id]);

    const fetchBooking = async () => {
        try {
            // Using the public endpoint for details as it returns the same info
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (res.ok) {
                const data = await res.json();
                setBooking(data);
            }
        } catch (error) {
            console.error('Failed to fetch booking', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this booking as ${newStatus}?`)) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                fetchBooking(); // Refresh details
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    if (loading) return <div className="p-8">Loading booking details...</div>;
    if (!booking) return <div className="p-8">Booking not found</div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <button
                        onClick={() => router.back()}
                        className="text-slate-500 hover:text-slate-700 mb-2 text-sm flex items-center gap-1"
                    >
                        ← Back to Bookings
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800">Booking #{booking.id}</h1>
                    <p className="text-slate-500">Created on {new Date(booking.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-3">
                    {booking.status !== 'CONFIRMED' && (
                        <button
                            onClick={() => updateStatus('CONFIRMED')}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Confirm Booking
                        </button>
                    )}
                    {booking.status !== 'CANCELLED' && (
                        <button
                            onClick={() => updateStatus('CANCELLED')}
                            className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Cancel Booking
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Shipment Details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Origin</label>
                                <p className="text-slate-800">{booking.originAddress}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Destination</label>
                                <p className="text-slate-800">{booking.destinationAddress}</p>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Goods Description</label>
                                <p className="text-slate-800">{booking.goodsDescription}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Financials</h2>
                        <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Total Amount</label>
                                <p className="text-2xl font-bold text-slate-800">{booking.currency} {booking.totalPrice?.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Status</label>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'CONFIRMED'
                                            ? 'bg-green-100 text-green-700'
                                            : booking.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">Contact Info</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Name</label>
                                <p className="text-slate-800">{booking.contactName}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Company</label>
                                <p className="text-slate-800">{booking.companyName}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Email</label>
                                <p className="text-slate-800 break-all">{booking.contactEmail}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 uppercase mb-1">Phone</label>
                                <p className="text-slate-800">{booking.contactPhone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
