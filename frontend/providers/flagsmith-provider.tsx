'use client';

import React, { ReactNode, useEffect } from 'react';
import flagsmith from 'flagsmith';
import { FlagsmithProvider as Provider } from 'flagsmith/react';
import { useAuth } from '@/context/AuthContext';

export const FlagsmithProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return; // Wait for auth to settle

        if (user?.email) {
            flagsmith.identify(user.email);
        } else {
            flagsmith.logout();
        }
    }, [user, isLoading]);

    return (
        <Provider
            flagsmith={flagsmith}
            options={{
                environmentID: process.env.NEXT_PUBLIC_FLAGSMITH_ID || '',
                onChange: (oldFlags, params) => {
                    // Optional: Handle flag updates
                }
            }}
        >
            {children}
        </Provider>
    );
};
