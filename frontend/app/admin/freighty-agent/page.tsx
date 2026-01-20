'use client';

import React from 'react';
import { AlertTriangle, AlertCircle, Info, Clock, Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DEMO_ALERTS, DemoAlert } from '@/data/demoAlertsData';

export default function FreightyAgentPage() {
    const router = useRouter();

    const getSeverityColor = (severity: DemoAlert['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-50 border-red-200';
            case 'warning': return 'bg-amber-50 border-amber-200';
            case 'info': return 'bg-blue-50 border-blue-200';
        }
    };

    const getSeverityIcon = (severity: DemoAlert['severity']) => {
        switch (severity) {
            case 'critical': return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            case 'info': return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getSeverityBadge = (severity: DemoAlert['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-100 text-red-700 border-red-300';
            case 'warning': return 'bg-amber-100 text-amber-700 border-amber-300';
            case 'info': return 'bg-blue-100 text-blue-700 border-blue-300';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-8 h-8 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-800">Freighty Agent</h1>
                </div>
                <p className="text-gray-600">
                    AI-powered shipment monitoring and intelligent routing recommendations
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Active Alerts</h2>
                <div className="space-y-4">
                    {DEMO_ALERTS.map(alert => (
                        <div
                            key={alert.id}
                            className={`border rounded-lg p-4 transition-all hover:shadow-md ${getSeverityColor(alert.severity)}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                    <div className="mt-1">
                                        {getSeverityIcon(alert.severity)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded border uppercase ${getSeverityBadge(alert.severity)}`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-sm font-mono text-gray-600">
                                                {alert.bookingId}
                                            </span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-800 mb-1">
                                            {alert.origin} → {alert.destination}
                                        </div>
                                        <div className="text-sm text-gray-700 mb-2">
                                            {alert.issue}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTimestamp(alert.timestamp)}
                                            </div>
                                            <div>
                                                Vessel: {alert.vesselName}
                                            </div>
                                            <div>
                                                Container: {alert.containerNumber}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => router.push(`/admin/freighty-agent/${alert.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
                                    >
                                        <Bot className="w-4 h-4" />
                                        Freighty agent
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold">Demo Module</span>
                </div>
                <p className="text-xs text-gray-600">
                    This is a demonstration module showcasing AI-powered shipment monitoring. All alerts and data are simulated for demo purposes.
                </p>
            </div>
        </div>
    );
}
