"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Plus, Edit, Trash, FileText, Megaphone, Layout } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

type ContentItem = {
    id: number;
    title: string;
    body: string;
    type: string;
    status: string;
    updatedAt: string;
};

export default function CMSPage() {
    const { token } = useAuth();
    const [items, setItems] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        type: "ANNOUNCEMENT",
        status: "DRAFT",
    });

    const fetchContent = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/api/admin/content`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setItems(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [token]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const url = editingItem
            ? `${API_BASE}/api/admin/content/${editingItem.id}`
            : `${API_BASE}/api/admin/content`;

        const method = editingItem ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ title: "", body: "", type: "ANNOUNCEMENT", status: "DRAFT" });
                fetchContent();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!token || !confirm("Are you sure you want to delete this item?")) return;
        try {
            await fetch(`${API_BASE}/api/admin/content/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchContent();
        } catch (err) {
            console.error(err);
        }
    };

    const openEdit = (item: ContentItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            body: item.body,
            type: item.type,
            status: item.status,
        });
        setIsModalOpen(true);
    };

    const openNew = () => {
        setEditingItem(null);
        setFormData({ title: "", body: "", type: "ANNOUNCEMENT", status: "DRAFT" });
        setIsModalOpen(true);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "ANNOUNCEMENT": return <Megaphone className="w-4 h-4 text-orange-500" />;
            case "BANNER": return <Layout className="w-4 h-4 text-blue-500" />;
            default: return <FileText className="w-4 h-4 text-gray-500" />;
        }
    };

    if (loading) return <div className="p-8 text-gray-400">Loading content...</div>;

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Content Management</h1>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Content
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                                {getTypeIcon(item.type)}
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{item.type}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                {item.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{item.body}</p>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                            <span className="text-xs text-gray-600">Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(item)} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-gray-800 rounded text-gray-400 hover:text-red-500">
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6">
                            {editingItem ? "Edit Content" : "New Content"}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="ANNOUNCEMENT">Announcement</option>
                                    <option value="BANNER">Banner</option>
                                    <option value="ARTICLE">Article</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="DRAFT">Draft</option>
                                    <option value="PUBLISHED">Published</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Body</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.body}
                                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Save Content
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
