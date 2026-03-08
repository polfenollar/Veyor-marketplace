'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/notifications`);
            if (res.ok) {
                setNotifications(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: number) => {
        // Optimistic update
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));

        try {
            await fetch(`${API_BASE}/api/notifications/${id}/read`, {
                method: 'PUT'
            });
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <Bell className="w-8 h-8" />
                    Notifications
                </h1>

                {loading ? (
                    <div>Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No notifications.</div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => !notification.read && markAsRead(notification.id)}
                                className={`bg-white rounded-lg p-4 shadow-sm border transition-all cursor-pointer ${notification.read ? 'border-gray-100 opacity-75' : 'border-blue-100 border-l-4 border-l-blue-500'}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">{getIcon(notification.type)}</div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>{notification.title}</h3>
                                            <span className="text-xs text-gray-400">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1 text-sm">{notification.message}</p>
                                    </div>
                                    {!notification.read && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
