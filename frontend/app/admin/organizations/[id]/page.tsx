'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Mail, Shield, User as UserIcon, Plus, Edit2, Trash2, Lock, Unlock, Key, Package } from 'lucide-react';
import Link from 'next/link';
import { UserShipmentsModal } from '@/components/UserShipmentsModal';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

import { useParams } from 'next/navigation';

export default function OrganizationDetailPage() {
    const params = useParams();
    const { token } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'BUYER',
        status: 'ACTIVE'
    });
    const [viewShipmentsUser, setViewShipmentsUser] = useState<number | null>(null);

    useEffect(() => {
        if (token) fetchOrgUsers();
    }, [token, params.id]);

    const fetchOrgUsers = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/organizations/${params.id}/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setUsers(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingUser) {
                // Update User Details
                await fetch(`${API_BASE}/api/admin/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        email: formData.email,
                        role: formData.role,
                        organizationId: parseInt(params.id as string)
                    })
                });

                // Update Status if changed
                if (editingUser.status !== formData.status) {
                    await fetch(`${API_BASE}/api/admin/users/${editingUser.id}/status`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                }

                // Update Password if provided
                if (formData.password) {
                    await fetch(`${API_BASE}/api/admin/users/${editingUser.id}/password`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ password: formData.password })
                    });
                }
            } else {
                // Create New User
                const res = await fetch(`${API_BASE}/api/admin/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                        status: 'ACTIVE',
                        organizationId: parseInt(params.id as string)
                    })
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || 'Failed to create user');
                }
            }

            // Refresh list and close modal
            await fetchOrgUsers();
            setShowModal(false);
            setEditingUser(null);
            setFormData({ email: '', password: '', role: 'BUYER', status: 'ACTIVE' });

        } catch (err: any) {
            console.error(err);
            alert('Operation failed: ' + (err.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchOrgUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (user: any) => {
        setEditingUser(user);
        setFormData({
            email: user.email,
            password: '', // Don't show current password
            role: user.role,
            status: user.status
        });
        setShowModal(true);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/organizations" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Organization Users</h1>
                </div>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setFormData({ email: '', password: '', role: 'BUYER', status: 'ACTIVE' });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-800">Users List</h2>
                    <p className="text-sm text-gray-500">All users associated with Organization #{params.id}</p>
                </div>

                {users.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No users found for this organization.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {users.map(user => (
                            <div key={user.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">User #{user.id}</div>
                                        <div className={`text-xs font-medium ${user.role === 'ADMIN' ? 'text-purple-600' : 'text-blue-600'
                                            }`}>
                                            {user.role}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>{user.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-gray-400" />
                                        <span className={user.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}>
                                            {user.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Key className="w-4 h-4 text-gray-400" />
                                        <span className="text-gray-400 italic">Password hidden</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        onClick={() => openEdit(user)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                        title="Edit User"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewShipmentsUser(user.id)}
                                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                        title="View Shipments"
                                    >
                                        <Package className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Delete User"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {viewShipmentsUser && (
                <UserShipmentsModal
                    userId={viewShipmentsUser}
                    onClose={() => setViewShipmentsUser(null)}
                />
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingUser ? 'Edit User' : 'Add New User'}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {editingUser ? 'New Password (Optional)' : 'Password'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingUser}
                                    placeholder={editingUser ? "Leave blank to keep current" : ""}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="BUYER">BUYER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            {editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="BLOCKED">BLOCKED</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    {editingUser ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
