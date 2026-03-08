'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DollarSign, Users, ShoppingCart, TrendingUp } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function AdminDashboard() {
    const { token } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchStats();
        }
    }, [token]);

    const fetchStats = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setStats(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total GMV"
                    value={stats ? `$${stats.gmv.toLocaleString()}` : '-'}
                    icon={DollarSign}
                    color="bg-green-500"
                />
                <StatCard
                    title="Active Users"
                    value={stats ? stats.activeUsers : '-'}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Booking Volume"
                    value={stats ? stats.bookingVolume : '-'}
                    icon={ShoppingCart}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Net Revenue"
                    value={stats ? `$${stats.revenue.toLocaleString()}` : '-'}
                    icon={TrendingUp}
                    color="bg-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">New organization registered: Global Logistics</span>
                            <span className="text-gray-400">2 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Booking #1234 confirmed</span>
                            <span className="text-gray-400">15 mins ago</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">User John Doe verified</span>
                            <span className="text-gray-400">1 hour ago</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">API Latency</span>
                            <span className="text-green-600 font-medium">45ms</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Error Rate</span>
                            <span className="text-green-600 font-medium">0.01%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Database Load</span>
                            <span className="text-yellow-600 font-medium">45%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
            <div className={`${color} p-4 rounded-full text-white mr-4`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}
