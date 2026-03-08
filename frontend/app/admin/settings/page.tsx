'use client';
import React from 'react';
import Link from 'next/link';
import { Database, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Master Data Management Card */}
                <Link href="/admin/master-data" className="block group">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all hover:border-blue-300">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <Database className="w-6 h-6" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            Master Data Management
                        </h3>
                        <p className="text-sm text-gray-500">
                            Manage system-wide master data including locations, container types, and other reference data.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
