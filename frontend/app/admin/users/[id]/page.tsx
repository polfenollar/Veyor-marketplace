'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function UserDetailPage() {
    const params = useParams();
    const { token } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [password, setPassword] = useState('');
    const [showPasswordReset, setShowPasswordReset] = useState(false);

    useEffect(() => {
        if (token) fetchUser();
    }, [token, params.id]);

    const fetchUser = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${params.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUser(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(user)
            });
            if (res.ok) {
                alert('User updated successfully');
                router.push('/admin/users');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update user');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordReset = async () => {
        if (!password) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${params.id}/password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });
            if (res.ok) {
                alert('Password reset successfully');
                setShowPasswordReset(false);
                setPassword('');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to reset password');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user) return <div>User not found</div>;

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/users" className="text-gray-500 hover:text-gray-700">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit User #{user.id}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={user.role}
                                    onChange={(e) => setUser({ ...user, role: e.target.value })}
                                >
                                    <option value="BUYER">BUYER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organization ID</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={user.organizationId || ''}
                                    onChange={(e) => setUser({ ...user, organizationId: parseInt(e.target.value) || null })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                                    {user.status}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-500" />
                            Security
                        </h3>

                        {!showPasswordReset ? (
                            <button
                                onClick={() => setShowPasswordReset(true)}
                                className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Reset Password
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePasswordReset}
                                        className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium"
                                    >
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowPasswordReset(false);
                                            setPassword('');
                                        }}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
