'use client';

import React, { useEffect, useState } from 'react';
import { useFlags } from 'flagsmith/react'; // Real hook
import { useAuth } from '@/context/AuthContext'; // Real Auth
import { Header } from '@/components/Header';
import ProfileVersionA from '@/components/crm/ProfileVersionA';
import ProfileVersionB from '@/components/crm/ProfileVersionB';

export default function ProfilePage() {
    const { user } = useAuth();
    const flags = useFlags(['abtest']); // Real flags
    const [profileData, setProfileData] = useState<any>({
        companyName: '',
        taxId: '',
        address: '',
        businessLicenseNumber: '',
        registrationDate: '',
        contactPerson: '',
    });
    const [kycStatus, setKycStatus] = useState('PENDING');
    const [loading, setLoading] = useState(true);

    // We rely on Flagsmith's `flags` which auto-update based on the Identity provided in FlagsmithProvider
    const showVersionB = flags.abtest?.value === 'B';

    useEffect(() => {
        if (user?.id) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            if (!user) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/profile`, {
                headers: {
                    // In production, you'd use the Bearer token. 
                    // For this specific requirement, we rely on the X-User-Id header which we'll populate 
                    // in a real app via middleware, but here we can pass it if we trust the client (we don't for prod, 
                    // but the backend validates it against the token).
                    // Wait, if backend validates against token, we should pass token. 
                    // But the backend implementation currently looks for X-User-Id. 
                    // Let's pass both and ensure backend validates.
                    'X-User-Id': user.id.toString(),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setProfileData(data);
                setKycStatus(data.kycStatus || 'PENDING');
            } else {
                // If 404, we just use default empty state
            }
        } catch (err) {
            console.error('Failed to fetch profile', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (!user) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Id': user.id.toString(),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });
            if (res.ok) {
                const saved = await res.json();
                setProfileData(saved);
                alert('Profile saved successfully!');
            } else {
                alert('Failed to save profile. Please check permissions.');
            }
        } catch (err) {
            alert('Error saving profile');
        }
    };

    const handleVerify = async () => {
        try {
            if (!user) return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/company/kyc`, {
                method: 'POST',
                headers: {
                    'X-User-Id': user.id.toString(),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                const saved = await res.json();
                setKycStatus(saved.kycStatus);
                alert('KYC Documents Submitted! Status: ' + saved.kycStatus);
            }
        } catch (err) {
            alert('Error initiating KYC');
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Please log in to view your profile.</div>;
    }

    if (loading && !profileData.companyName) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <p className="text-sm font-medium text-gray-500">
                        Logged in as: <span className="font-bold text-indigo-600">{user.email}</span>
                    </p>
                </div>

                {showVersionB ? (
                    <ProfileVersionB
                        initialData={profileData}
                        onSave={handleSave}
                        kycStatus={kycStatus}
                        onVerify={handleVerify}
                    />
                ) : (
                    <ProfileVersionA
                        initialData={profileData}
                        onSave={handleSave}
                        kycStatus={kycStatus}
                        onVerify={handleVerify}
                    />
                )}
            </main>
        </div>
    );
}
