import React from 'react';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';

// Mock next/link
jest.mock('next/link', () => {
    return ({ children, href }: { children: React.ReactNode; href: string }) => {
        return <a href={href}>{children}</a>;
    };
});

describe('Dashboard Component', () => {
    it('renders all three cards', () => {
        render(<Dashboard />);
        expect(screen.getByText('Manage your shipments')).toBeInTheDocument();
        expect(screen.getByText('Manage your payments')).toBeInTheDocument();
        expect(screen.getByText('Freightos credit')).toBeInTheDocument();
    });

    it('renders functional buttons with correct links', () => {
        render(<Dashboard />);

        const shipmentLink = screen.getByRole('link', { name: /book your first shipment/i });
        expect(shipmentLink).toHaveAttribute('href', '/shipments');

        const paymentLink = screen.getByRole('link', { name: /view payments/i });
        expect(paymentLink).toHaveAttribute('href', '/account/billing');

        const creditLink = screen.getByRole('link', { name: /get started with credit/i });
        expect(creditLink).toHaveAttribute('href', '/account/credit');
    });

    it('has accessible buttons', () => {
        render(<Dashboard />);
        expect(screen.getByLabelText('Book your first shipment')).toBeInTheDocument();
        expect(screen.getByLabelText('View payments')).toBeInTheDocument();
        expect(screen.getByLabelText('Contact support')).toBeInTheDocument();
        expect(screen.getByLabelText('Get started with credit')).toBeInTheDocument();
    });
});
