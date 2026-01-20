'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { RecommendedServices } from '../../components/RecommendedServices';

export default function RecommendedServicesPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleConfirm = () => {
        // Pass search parameters through to results page
        const params = searchParams.toString();
        router.push(`/results${params ? `?${params}` : ''}`);
    };

    return <RecommendedServices
        onConfirm={handleConfirm}
        origin={searchParams.get('origin') || undefined}
        destination={searchParams.get('destination') || undefined}
        load={searchParams.get('load') || undefined}
        goods={searchParams.get('goods') || undefined}
    />;
}
