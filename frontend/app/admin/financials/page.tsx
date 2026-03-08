"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { DollarSign, FileText, TrendingUp } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Transaction = {
    id: number;
    type: string;
    amount: number;
    currency: string;
    status: string;
    reference: string;
    createdAt: string;
};

type Stats = {
    totalRevenue: number;
    transactionCount: number;
    currency: string;
};

export default function FinancialsPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [statsRes, txRes] = await Promise.all([
                    fetch(`${API_BASE}/api/admin/financials/stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${API_BASE}/api/admin/financials/transactions`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!statsRes.ok || !txRes.ok) throw new Error("Failed to fetch data");

                const statsData = await statsRes.json();
                const txData = await txRes.json();

                setStats(statsData);
                setTransactions(txData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) return <div className="p-8 text-gray-400">Loading financials...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Financial Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-400 text-sm font-medium">Total Revenue</h3>
                        <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {stats?.totalRevenue?.toLocaleString()} {stats?.currency}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Duplicate card for layout balance, or placeholder for future stats */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-400 text-sm font-medium">Transactions</h3>
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-white">
                            {stats?.transactionCount}
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <section className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-lg font-semibold text-white">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-gray-950 text-gray-200 uppercase font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Reference</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{tx.id}</td>
                                    <td className="px-6 py-4 text-white">{tx.type}</td>
                                    <td className="px-6 py-4 font-mono">{tx.reference}</td>
                                    <td className="px-6 py-4 text-white font-medium">
                                        {tx.amount} {tx.currency}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${tx.status === "SUCCESS"
                                                    ? "bg-green-500/10 text-green-500"
                                                    : tx.status === "PENDING"
                                                        ? "bg-yellow-500/10 text-yellow-500"
                                                        : "bg-red-500/10 text-red-500"
                                                }`}
                                        >
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {new Date(tx.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    );
}
