'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Building2, Users, MoreVertical, ShieldAlert, ShieldCheck, Plus, Edit2, Trash2, Lock, Unlock } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function OrganizationsPage() {
    const { token } = useAuth();
    const [orgs, setOrgs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editingOrg, setEditingOrg] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', adminEmail: '' });

    useEffect(() => {
        if (token) fetchOrgs();
    }, [token]);

    const fetchOrgs = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/organizations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setOrgs(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingOrg
            ? `${API_BASE}/api/admin/organizations/${editingOrg.id}`
            : `${API_BASE}/api/admin/organizations`;
        const method = editingOrg ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                fetchOrgs();
                setShowModal(false);
                setEditingOrg(null);
                setFormData({ name: '', adminEmail: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this organization?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/organizations/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchOrgs();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE}/api/admin/organizations/${id}/status`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchOrgs();
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (org: any) => {
        setEditingOrg(org);
        setFormData({ name: org.name, adminEmail: org.adminEmail });
        setShowModal(true);
        setActiveMenu(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div onClick={() => setActiveMenu(null)}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Organizations</h1>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setEditingOrg(null);
                        setFormData({ name: '', adminEmail: '' });
                        setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4" />
                    Create Organization
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orgs.map(org => (
                    <div key={org.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative group">
                        <div className="absolute top-4 right-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === org.id ? null : org.id);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeMenu === org.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-10 py-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEdit(org); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        <Edit2 className="w-4 h-4" /> Edit Details
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleStatus(org.id); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                        {org.status === 'ACTIVE' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                        {org.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(org.id); }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        <Link href={`/admin/organizations/${org.id}`} className="block">
                            <div className="flex items-start justify-between mb-4 pr-8">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${org.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {org.status === 'ACTIVE' ? <ShieldCheck className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                                    {org.status}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                {org.name}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">{org.adminEmail}</p>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>View Users</span>
                                </div>
                                <span className="text-xs">ID: {org.id}</span>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            {editingOrg ? 'Edit Organization' : 'Create Organization'}
                        </h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.adminEmail}
                                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                />
                            </div>
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
                                    {editingOrg ? 'Save Changes' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
