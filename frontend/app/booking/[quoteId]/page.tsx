'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { BookingForm } from '../../../components/BookingForm';
import { Quote } from '../../../types';
import { MOCK_QUOTES } from '../../../constants';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export default function BookingPage() {
    const params = useParams();
    const quoteId = params.quoteId as string;
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would fetch the specific quote details from the backend
        // For now, we'll try to find it in MOCK_QUOTES or fetch all and find it
        // Since our backend /api/tariffs returns a list, we can fetch that.

        const fetchQuote = async () => {
            try {
                // 1. Check sessionStorage first (set by results page on Select click)
                const cached = sessionStorage.getItem(`quote_${quoteId}`);
                if (cached) {
                    setQuote(JSON.parse(cached));
                    return;
                }

                // 2. Try fetching from tariffs (numeric IDs from DB)
                const res = await fetch(`${API_BASE}/api/tariffs`);
                if (res.ok) {
                    const data = await res.json();
                    const found = data.find((t: any) => t.id.toString() === quoteId);
                    if (found) {
                        setQuote({
                            id: found.id.toString(),
                            providerName: found.carrierName,
                            rating: 4.5,
                            reviewCount: 50,
                            price: found.price,
                            currency: found.currency,
                            transitTimeDays: found.transitTimeDays,
                            minDays: found.transitTimeDays,
                            maxDays: found.transitTimeDays + 2,
                            mode: found.mode.toLowerCase(),
                            tags: [],
                            route: {
                                originCode: found.originPort,
                                destinationCode: found.destinationPort,
                                stops: []
                            }
                        });
                        return;
                    }
                }

                // 3. Fallback to MOCK_QUOTES
                const mockFound = MOCK_QUOTES.find(q => q.id === quoteId);
                if (mockFound) {
                    setQuote(mockFound);
                }
            } catch (err) {
                console.error(err);
                const mockFound = MOCK_QUOTES.find(q => q.id === quoteId);
                if (mockFound) setQuote(mockFound);
            } finally {
                setLoading(false);
            }
        };

        if (quoteId) {
            fetchQuote();
        }
    }, [quoteId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!quote) return <div className="min-h-screen flex items-center justify-center">Quote not found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <BookingForm quote={quote} />
        </div>
    );
}
