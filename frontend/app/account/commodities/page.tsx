'use client';

import React, { useEffect, useState } from 'react';
import { Package, Plus, Trash2, Box } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

interface CommodityTemplate {
    id?: number;
    name: string;
    description: string;
    hsCode: string;
    weight: number;
    dimensions: string;
}

export default function CommoditiesPage() {
    const [templates, setTemplates] = useState<CommodityTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CommodityTemplate>({
        name: '',
        description: '',
        hsCode: '',
        weight: 0,
        dimensions: ''
    });

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/commodities`);
            if (res.ok) {
                setTemplates(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/commodities`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                await fetchTemplates();
                setShowForm(false);
                setFormData({ name: '', description: '', hsCode: '', weight: 0, dimensions: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this template?')) return;
        try {
            await fetch(`${API_BASE}/api/commodities/${id}`, {
                method: 'DELETE'
            });
            setTemplates(templates.filter(t => t.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading templates...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Box className="w-8 h-8" />
                        Commodities Templates
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium flex items-center gap-2 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Template
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">New Template</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="e.g. Electronics" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">HS Code</label>
                                <input type="text" name="hsCode" value={formData.hsCode} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="e.g. 8517.13" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input type="text" name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="Description of goods" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (cm)</label>
                                <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full p-2 border rounded" required placeholder="LxWxH" />
                            </div>
                            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Template</button>
                            </div>
                        </form>
                    </div>
                )}

                {templates.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Box className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No templates yet</h3>
                        <p className="text-gray-500">Create templates to speed up your booking process.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative group">
                                <button
                                    onClick={() => handleDelete(template.id!)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <h3 className="font-bold text-gray-800 text-lg mb-1">{template.name}</h3>
                                <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">HS Code:</span>
                                        <span className="font-medium">{template.hsCode}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Weight:</span>
                                        <span className="font-medium">{template.weight} kg</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Dimensions:</span>
                                        <span className="font-medium">{template.dimensions}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
