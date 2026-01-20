"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Trash, MapPin, Package } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type Location = {
    id: number;
    code: string;
    name: string;
    type: string;
    country: string;
};

type Commodity = {
    id: number;
    name: string;
    description: string;
    restricted: boolean;
};

export default function MasterDataPage() {
    const { token } = useAuth();
    const [locations, setLocations] = useState<Location[]>([]);
    const [commodities, setCommodities] = useState<Commodity[]>([]);
    const [activeTab, setActiveTab] = useState<"LOCATIONS" | "COMMODITIES">("LOCATIONS");
    const [loading, setLoading] = useState(true);

    // Forms
    const [locForm, setLocForm] = useState({ code: "", name: "", type: "PORT", country: "" });
    const [comForm, setComForm] = useState({ name: "", description: "", restricted: false });

    const fetchData = async () => {
        if (!token) return;
        try {
            const [locRes, comRes] = await Promise.all([
                fetch(`${API_BASE}/api/admin/master-data/locations`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_BASE}/api/admin/master-data/commodities`, { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (locRes.ok) setLocations(await locRes.json());
            if (comRes.ok) setCommodities(await comRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    const handleCreateLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            await fetch(`${API_BASE}/api/admin/master-data/locations`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(locForm),
            });
            setLocForm({ code: "", name: "", type: "PORT", country: "" });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCommodity = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;
        try {
            await fetch(`${API_BASE}/api/admin/master-data/commodities`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(comForm),
            });
            setComForm({ name: "", description: "", restricted: false });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (type: "locations" | "commodities", id: number) => {
        if (!token || !confirm("Delete this item?")) return;
        try {
            await fetch(`${API_BASE}/api/admin/master-data/${type}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-8 text-gray-400">Loading master data...</div>;

    return (
        <main className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Master Data Management</h1>

            <div className="flex gap-4 mb-6 border-b border-gray-800">
                <button
                    onClick={() => setActiveTab("LOCATIONS")}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === "LOCATIONS" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`}
                >
                    Locations
                </button>
                <button
                    onClick={() => setActiveTab("COMMODITIES")}
                    className={`pb-3 px-4 font-medium transition-colors ${activeTab === "COMMODITIES" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-400 hover:text-white"}`}
                >
                    Commodities
                </button>
            </div>

            {activeTab === "LOCATIONS" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {locations.map((loc) => (
                            <div key={loc.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-2 rounded">
                                        <MapPin className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{loc.code} - {loc.name}</div>
                                        <div className="text-sm text-gray-500">{loc.type} • {loc.country}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete("locations", loc.id)} className="text-gray-500 hover:text-red-500 p-2">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Create Form */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg h-fit">
                        <h3 className="font-bold text-white mb-4">Add Location</h3>
                        <form onSubmit={handleCreateLocation} className="space-y-4">
                            <input required placeholder="Code (e.g. US-LAX)" value={locForm.code} onChange={e => setLocForm({ ...locForm, code: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
                            <input required placeholder="Name" value={locForm.name} onChange={e => setLocForm({ ...locForm, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
                            <select value={locForm.type} onChange={e => setLocForm({ ...locForm, type: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">
                                <option value="PORT">Port</option>
                                <option value="AIRPORT">Airport</option>
                            </select>
                            <input required placeholder="Country" value={locForm.country} onChange={e => setLocForm({ ...locForm, country: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">Add Location</button>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === "COMMODITIES" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* List */}
                    <div className="lg:col-span-2 space-y-4">
                        {commodities.map((com) => (
                            <div key={com.id} className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-800 p-2 rounded">
                                        <Package className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-white">{com.name}</div>
                                        <div className="text-sm text-gray-500">{com.description}</div>
                                        {com.restricted && <span className="text-xs text-red-400 font-medium">Restricted Item</span>}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete("commodities", com.id)} className="text-gray-500 hover:text-red-500 p-2">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Create Form */}
                    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg h-fit">
                        <h3 className="font-bold text-white mb-4">Add Commodity</h3>
                        <form onSubmit={handleCreateCommodity} className="space-y-4">
                            <input required placeholder="Name" value={comForm.name} onChange={e => setComForm({ ...comForm, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
                            <textarea required placeholder="Description" value={comForm.description} onChange={e => setComForm({ ...comForm, description: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white" />
                            <label className="flex items-center gap-2 text-gray-300">
                                <input type="checkbox" checked={comForm.restricted} onChange={e => setComForm({ ...comForm, restricted: e.target.checked })} className="w-4 h-4" />
                                Restricted Item
                            </label>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">Add Commodity</button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
