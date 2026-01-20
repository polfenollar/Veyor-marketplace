'use client';

import React, { useEffect, useState } from 'react';
import { Building, FileText, CheckCircle, AlertCircle, Upload } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CompanyProfile {
    id?: number;
    companyName: string;
    taxId: string;
    address: string;
    kycStatus: string;
}

export default function CompanyProfilePage() {
    const [profile, setProfile] = useState<CompanyProfile>({
        companyName: '',
        taxId: '',
        address: '',
        kycStatus: 'PENDING'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/company/profile`);
            if (res.ok) {
                setProfile(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch(`${API_BASE}/api/company/profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (res.ok) {
                setProfile(await res.json());
                setMessage('Profile updated successfully.');
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    const handleUploadKyc = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/company/kyc`, {
                method: 'POST'
            });
            if (res.ok) {
                setProfile(await res.json());
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    <Building className="w-8 h-8" />
                    Company Profile
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Company Details</h2>
                            {message && (
                                <div className={`mb-4 p-3 rounded text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                    {message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={profile.companyName}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / VAT Number</label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={profile.taxId}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={profile.address}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* KYC Status */}
                    <div>
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">KYC Status</h2>

                            <div className="flex items-center gap-3 mb-6">
                                {profile.kycStatus === 'VERIFIED' ? (
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-gray-800">{profile.kycStatus}</div>
                                    <div className="text-sm text-gray-500">
                                        {profile.kycStatus === 'VERIFIED' ? 'Your account is verified.' : 'Verification required.'}
                                    </div>
                                </div>
                            </div>

                            {profile.kycStatus !== 'VERIFIED' && (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-600">Please upload your business registration documents to verify your account.</p>
                                    <button
                                        onClick={handleUploadKyc}
                                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors border border-gray-300"
                                    >
                                        <Upload className="w-4 h-4" />
                                        Upload Documents
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
