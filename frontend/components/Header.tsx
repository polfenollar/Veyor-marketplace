'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, User, Menu, X, Shield, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    // Check if user has any admin role
    const isAdmin = user?.role && ['SUPER_ADMIN', 'FINANCE_MANAGER', 'SUPPORT_AGENT', 'ADMIN'].includes(user.role);

    return (
        <header className="bg-[var(--primary)] text-[var(--text-inverse)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center">
                            <Image src="/veyor-logo.svg" alt="VEYOR" width={186} height={48} priority />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] px-3 py-2 rounded-md text-sm font-medium">Home</Link>
                        <Link href="/shipments" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] px-3 py-2 rounded-md text-sm font-medium">My Shipments</Link>
                        <Link href="/account/billing" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] px-3 py-2 rounded-md text-sm font-medium">Billing</Link>
                        <Link href="/account/commodities" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] px-3 py-2 rounded-md text-sm font-medium">Commodities</Link>
                        <Link href="/account/referrals" className="text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                            <Users className="w-4 h-4" /> Referrals
                        </Link>
                        {isAdmin && (
                            <Link href="/admin/organizations" className="text-[var(--accent-muted)] hover:text-[var(--nav-link-hover)] px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                                <Shield className="w-4 h-4" /> Admin
                            </Link>
                        )}
                    </nav>

                    {/* Right Side Icons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/notifications" className="p-2 rounded-full hover:bg-white/10 relative">
                            <Bell className="w-5 h-5 text-[var(--nav-link)]" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/account/profile" className="flex items-center gap-2 text-sm hover:text-[var(--nav-link-hover)] text-[var(--nav-link)]">
                                    <User className="w-5 h-5" />
                                    <span>{user.email}</span>
                                </Link>
                                <button onClick={logout} className="text-xs border border-[var(--nav-link)] px-2 py-1 rounded hover:bg-white/10">Logout</button>
                            </div>
                        ) : (
                            <Link href="/auth/login" className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-2 rounded text-sm font-medium">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-md text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)]"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[var(--primary)] px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-[var(--primary-hover)]">
                    <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">Home</Link>
                    <Link href="/shipments" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">My Shipments</Link>
                    <Link href="/account/billing" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">Billing</Link>
                    <Link href="/account/commodities" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">Commodities</Link>
                    <Link href="/account/referrals" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">Referrals</Link>
                    {isAdmin && (
                        <Link href="/admin/organizations" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--accent-muted)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">Admin</Link>
                    )}
                    {!user && (
                        <Link href="/auth/login" className="block px-3 py-2 rounded-md text-base font-medium text-[var(--accent-muted)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--primary-hover)]">Login</Link>
                    )}
                </div>
            )}
        </header>
    );
};
