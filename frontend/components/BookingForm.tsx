import React, { useState } from 'react';
import { Quote } from '../types';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface BookingFormProps {
    quote: Quote;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const BookingForm: React.FC<BookingFormProps> = ({ quote }) => {
    const router = useRouter();
    const { token } = useAuth();
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Payment Methods
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);

    // Add Card Modal State
    const [showAddCardModal, setShowAddCardModal] = useState(false);
    const [newCard, setNewCard] = useState({
        holderName: '',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: ''
    });

    const [formData, setFormData] = useState({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        companyName: '',
        originAddress: '',
        destinationAddress: '',
        goodsDescription: '',
    });

    // Load form data from localStorage on mount
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const storageKey = `bookingFormData_${quote.id}`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const { formData: savedFormData, step: savedStep } = JSON.parse(saved);
                setFormData(savedFormData);
                setStep(savedStep);
            } catch (err) {
                console.error('Failed to restore booking data:', err);
            }
        }
    }, [quote.id]);

    // Save form data to localStorage whenever it changes
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        const storageKey = `bookingFormData_${quote.id}`;
        localStorage.setItem(storageKey, JSON.stringify({
            formData,
            step
        }));
    }, [formData, step, quote.id]);

    // Clear localStorage on successful booking
    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        if (step === 3) {
            const storageKey = `bookingFormData_${quote.id}`;
            localStorage.removeItem(storageKey);
        }
    }, [step, quote.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchPaymentMethods = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/api/payment-methods`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const methods = await res.json();
                setPaymentMethods(methods);
                if (methods.length > 0) {
                    const defaultMethod = methods.find((m: any) => m.isDefault);
                    setSelectedPaymentMethod(defaultMethod ? defaultMethod.id : methods[0].id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        const last4 = newCard.cardNumber.slice(-4);

        try {
            const res = await fetch(`${API_BASE}/api/payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'CARD',
                    last4,
                    expiryMonth: newCard.expiryMonth,
                    expiryYear: newCard.expiryYear,
                    holderName: newCard.holderName,
                })
            });

            if (res.ok) {
                setShowAddCardModal(false);
                setNewCard({ holderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvc: '' });
                await fetchPaymentMethods(); // Refresh payment methods list
            } else {
                setError('Failed to save card. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save card. Please check your connection.');
        }
    };

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (step === 1) {
            await fetchPaymentMethods();
            setStep(2);
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (!token) {
            setError('You must be logged in to book.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quoteId: quote.id,
                    totalPrice: quote.price,
                    currency: quote.currency,
                    ...formData,
                    // In a real app, we'd pass the payment token or method ID here
                    paymentMethodId: selectedPaymentMethod
                }),
            });

            if (!res.ok) throw new Error('Booking failed');

            setStep(3); // Success step
        } catch (err) {
            console.error(err);
            setError('Failed to create booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (step === 3) {
        return (
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center mt-10">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">Your shipment has been successfully booked.</p>
                <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
                    <h3 className="font-bold text-gray-700 mb-2">Booking Summary</h3>
                    <p className="text-sm text-gray-600">Provider: <span className="font-medium">{quote.providerName}</span></p>
                    <p className="text-sm text-gray-600">Total: <span className="font-medium">{quote.currency === 'EUR' ? '€' : '$'}{quote.price}</span></p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button onClick={() => step === 1 ? router.back() : setStep(1)} className="flex items-center text-gray-500 hover:text-gray-700 mb-6">
                <ArrowLeft className="w-4 h-4 mr-1" /> {step === 1 ? 'Back to Results' : 'Back to Details'}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">{step === 1 ? 'Booking Details' : 'Payment'}</h2>

                        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                        <form onSubmit={handleNext} className="space-y-6">

                            {step === 1 && (
                                <>
                                    {/* Contact Info */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                                <input required name="contactName" value={formData.contactName} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input required type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input required name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                                <input required name="companyName" value={formData.companyName} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Addresses */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Addresses</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Origin Address</label>
                                                <input required name="originAddress" value={formData.originAddress} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Street, City, Zip, Country" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Destination Address</label>
                                                <input required name="destinationAddress" value={formData.destinationAddress} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Street, City, Zip, Country" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Goods */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Shipment Details</h3>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Goods Description</label>
                                            <textarea required name="goodsDescription" value={formData.goodsDescription} onChange={handleChange} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe your cargo..." />
                                        </div>
                                    </div>
                                </>
                            )}

                            {step === 2 && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">Select Payment Method</h3>

                                    {paymentMethods.length === 0 ? (
                                        <div className="text-center py-8 bg-gray-50 rounded border border-dashed border-gray-300">
                                            <p className="text-gray-500 mb-4">No saved payment methods found.</p>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddCardModal(true)}
                                                className="text-blue-600 font-medium hover:underline"
                                            >
                                                Add a Payment Method
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {paymentMethods.map(method => (
                                                <label key={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-300'}`}>
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={method.id}
                                                        checked={selectedPaymentMethod === method.id}
                                                        onChange={() => setSelectedPaymentMethod(method.id)}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <div className="ml-4 flex-1">
                                                        <div className="font-bold text-gray-800">•••• •••• •••• {method.last4}</div>
                                                        <div className="text-sm text-gray-500">Expires {method.expiryMonth}/{method.expiryYear}</div>
                                                    </div>
                                                </label>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setShowAddCardModal(true)}
                                                className="w-full text-blue-600 font-medium hover:bg-blue-50 py-2 rounded transition-colors text-sm"
                                            >
                                                + Add Another Payment Method
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded shadow transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : (step === 1 ? 'Continue to Payment' : 'Confirm & Book')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary Sidebar */}
                <div>
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                        <h3 className="font-bold text-gray-800 mb-4">Quote Summary</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Provider</span>
                                <span className="font-medium">{quote.providerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Mode</span>
                                <span className="font-medium capitalize">{quote.mode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Transit Time</span>
                                <span className="font-medium">{quote.minDays}-{quote.maxDays} days</span>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-xl text-blue-600">
                                    {quote.currency === 'EUR' ? '€' : '$'}{quote.price}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Card Modal */}
            {showAddCardModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Card</h3>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                <input
                                    required
                                    value={newCard.holderName}
                                    onChange={e => setNewCard({ ...newCard, holderName: e.target.value })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <input
                                    required
                                    value={newCard.cardNumber}
                                    onChange={e => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\s/g, '') })}
                                    className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={16}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <div className="flex gap-2">
                                        <input
                                            required
                                            value={newCard.expiryMonth}
                                            onChange={e => setNewCard({ ...newCard, expiryMonth: e.target.value })}
                                            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            placeholder="MM"
                                            maxLength={2}
                                        />
                                        <input
                                            required
                                            value={newCard.expiryYear}
                                            onChange={e => setNewCard({ ...newCard, expiryYear: e.target.value })}
                                            className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                            placeholder="YY"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <input
                                        required
                                        value={newCard.cvc}
                                        onChange={e => setNewCard({ ...newCard, cvc: e.target.value })}
                                        className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                                        placeholder="123"
                                        maxLength={4}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddCardModal(false);
                                        setNewCard({ holderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvc: '' });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                >
                                    Save Card
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
