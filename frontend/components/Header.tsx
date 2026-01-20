'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, User, Menu, X, Shield, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    // Check if user has any admin role
    const isAdmin = user?.role && ['SUPER_ADMIN', 'FINANCE_MANAGER', 'SUPPORT_AGENT', 'ADMIN'].includes(user.role);

    return (
        <header className="bg-[#0b2d51] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="font-bold text-xl tracking-tight">FREIGHTOS</Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link href="/shipments" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My Shipments</Link>
                        <Link href="/account/billing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Billing</Link>
                        <Link href="/account/commodities" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Commodities</Link>
                        <Link href="/account/referrals" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                            <Users className="w-4 h-4" /> Referrals
                        </Link>
                        {isAdmin && (
                            <Link href="/admin/organizations" className="text-red-300 hover:text-red-100 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                                <Shield className="w-4 h-4" /> Admin
                            </Link>
                        )}
                    </nav>

                    {/* Right Side Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/notifications" className="p-2 rounded-full hover:bg-white/10 relative">
                            <Bell className="w-5 h-5 text-gray-300" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/account/profile" className="flex items-center gap-2 text-sm hover:text-white text-gray-300">
                                    <User className="w-5 h-5" />
                                    <span>{user.email}</span>
                                </Link>
                                <button onClick={logout} className="text-xs border border-gray-500 px-2 py-1 rounded hover:bg-white/10">Logout</button>
                            </div>
                        ) : (
                            <Link href="/auth/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#0b2d51] px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
                    <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700">Home</Link>
                    <Link href="/shipments" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">My Shipments</Link>
                    <Link href="/account/billing" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Billing</Link>
                    <Link href="/account/commodities" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Commodities</Link>
                    <Link href="/account/referrals" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Referrals</Link>
                    {isAdmin && (
                        <Link href="/admin/organizations" className="block px-3 py-2 rounded-md text-base font-medium text-red-300 hover:text-white hover:bg-gray-700">Admin</Link>
                    )}
                    {!user && (
                        <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-300 hover:text-white hover:bg-gray-700">Login</Link>
                    )}
                </div>
            )}
        </header>
    );
};
