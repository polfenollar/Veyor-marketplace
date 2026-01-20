'use client';

import React, { useEffect, useState } from 'react';
import { Users, Gift, Send, DollarSign, Clock, CheckCircle } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface Referral {
    id: number;
    refereeEmail: string;
    status: string;
    createdAt: string;
}

export default function ReferralsPage() {
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [refRes, balRes] = await Promise.all([
                fetch(`${API_BASE}/api/referrals`),
                fetch(`${API_BASE}/api/credits/balance`)
            ]);

            if (refRes.ok) setReferrals(await refRes.json());
            if (balRes.ok) {
                const balData = await balRes.json();
                setBalance(balData.balance);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviting(true);
        setMessage('');

        try {
            const res = await fetch(`${API_BASE}/api/referrals/invite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                const newReferral = await res.json();
                setReferrals([newReferral, ...referrals]);
                setEmail('');
                setMessage('Invite sent successfully!');
            } else {
                setMessage('Failed to send invite.');
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred.');
        } finally {
            setInviting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading referrals...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <Users className="w-8 h-8" />
                    Referrals & Credits
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Balance Card */}
                    <div className="md:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Available Credits</h2>
                            <p className="text-blue-100">Use these credits for your next shipment.</p>
                        </div>
                        <div className="text-5xl font-bold mt-4 md:mt-0 flex items-start">
                            <span className="text-2xl mt-2">$</span>
                            {balance.toFixed(2)}
                        </div>
                    </div>

                    {/* Invite Form */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Gift className="w-5 h-5 text-purple-500" />
                                Invite a Friend
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Earn $50 for every friend who signs up and books their first shipment.
                            </p>
                            <form onSubmit={handleInvite}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Friend's Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={inviting}
                                    className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    {inviting ? 'Sending...' : 'Send Invite'}
                                </button>
                                {message && (
                                    <div className={`mt-4 text-sm text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                        {message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Referrals List */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Your Referrals</h3>
                            {referrals.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No referrals yet. Start inviting!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {referrals.map(referral => (
                                        <div key={referral.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
                                            <div>
                                                <div className="font-medium text-gray-800">{referral.refereeEmail}</div>
                                                <div className="text-xs text-gray-400">{new Date(referral.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {referral.status === 'COMPLETED' ? (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                        <CheckCircle className="w-3 h-3" /> Completed
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                                        <Clock className="w-3 h-3" /> Pending
                                                    </span>
                                                )}
                                            </div>
                                        </div>
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
