import React from 'react';
import { Ship, FileText, CreditCard } from 'lucide-react';
import Link from 'next/link';

export const Dashboard: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto w-full px-4 md:px-8 -mt-10 mb-20 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                        <Ship className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Manage your shipments</h3>
                    <p className="text-sm text-gray-500 mb-6 flex-1">
                        Once you make your first booking, we make it easy to manage your shipment.
                    </p>
                    <div className="space-y-3 w-full">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-purple-200"></span> Booked
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-yellow-200"></span> In transit
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-200"></span> Delivered
                        </div>
                    </div>
                    <Link href="/shipments" className="mt-6 w-full block">
                        <button className="w-full py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition" aria-label="Book your first shipment">
                            Book your first shipment
                        </button>
                    </Link>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Manage your payments</h3>
                    <p className="text-sm text-gray-500 mb-6 flex-1">
                        Once you book a shipment, stay up-to-date on your bills and payments.
                    </p>
                    <div className="space-y-3 w-full">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-purple-200"></span> Open
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-yellow-200"></span> Payment due
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-200"></span> Paid in full
                        </div>
                    </div>
                    <Link href="/account/billing" className="mt-6 w-full block">
                        <button className="w-full py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition" aria-label="View payments">
                            View payments
                        </button>
                    </Link>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                        <CreditCard className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Freightos credit</h3>
                    <p className="text-sm text-gray-500 mb-6 flex-1">
                        Based in the US, UK, or Canada? Has your business been running for at least 1 year? Take advantage of our generous credit terms.
                    </p>
                    <button className="mt-auto w-full py-2 bg-transparent text-blue-600 font-medium text-sm hover:underline text-left px-0" aria-label="Contact support">
                        Contact support
                    </button>
                    <Link href="/account/credit" className="mt-2 w-full block">
                        <button className="w-full py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition" aria-label="Get started with credit">
                            Get started
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
