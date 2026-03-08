import React, { useState } from 'react';

interface ProfileData {
    companyName: string;
    taxId: string;
    address: string;
    businessLicenseNumber: string;
    registrationDate: string;
    contactPerson: string;
}

interface ProfileVersionBProps {
    initialData: ProfileData;
    onSave: (data: ProfileData) => void;
    kycStatus: string;
    onVerify: () => void;
}

const ProfileVersionB: React.FC<ProfileVersionBProps> = ({ initialData, onSave, kycStatus, onVerify }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<ProfileData>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-indigo-900">Company Registration Wizard (Version B)</h2>
                <div className="flex space-x-2">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-2 w-8 rounded-full ${step >= s ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    ))}
                </div>
            </div>

            <div className="mb-8 flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100">
                <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Verification Status</p>
                    <p className="text-lg font-bold text-gray-900">{kycStatus}</p>
                </div>
                {kycStatus === 'PENDING' && (
                    <button
                        onClick={onVerify}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform transition active:scale-95"
                    >
                        Verify Now
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="animate-fadeIn">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Step 1: Company Essentials</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Legal Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="e.g. Global Logistics Inc."
                                    className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tax ID / VAT Number</label>
                                    <input
                                        type="text"
                                        name="taxId"
                                        value={formData.taxId}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Registration Date</label>
                                    <input
                                        type="date"
                                        name="registrationDate"
                                        value={formData.registrationDate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fadeIn">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Step 2: Legal & Contact</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Business License Number</label>
                                <input
                                    type="text"
                                    name="businessLicenseNumber"
                                    value={formData.businessLicenseNumber}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Point of Contact</label>
                                <input
                                    type="text"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fadeIn">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Step 3: Headquarters</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Business Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={4}
                                className="mt-1 block w-full px-4 py-3 rounded-lg border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50/50"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-6 mt-8 border-t border-gray-100">
                    {step > 1 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="px-6 py-2.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                        >
                            Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="px-8 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition"
                        >
                            Continue
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="px-8 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition"
                        >
                            Complete Registration
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProfileVersionB;
