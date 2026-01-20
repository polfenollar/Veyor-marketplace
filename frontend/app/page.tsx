"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { SearchSection } from '../components/SearchSection';
import { Dashboard } from '../components/Dashboard';

export default function Home() {
  const router = useRouter();

  const handleSearch = () => {
    router.push('/results');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SearchSection onSearch={handleSearch} />
      <Dashboard />
    </div>
  );
}
