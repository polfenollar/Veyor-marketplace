
"use client";

import React, { useState } from 'react';
import { Search, MapPin, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LOCATIONS, LOAD_TYPES, GOODS_TYPES } from '../data/mockData'; // Added useRouter import

interface SearchSectionProps {
    onSearch: () => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
    const [loadModalOpen, setLoadModalOpen] = useState(false);
    const [originSearch, setOriginSearch] = useState('');
    const [destSearch, setDestSearch] = useState('');
    const [showOriginDropdown, setShowOriginDropdown] = useState(false);
    const [showDestDropdown, setShowDestDropdown] = useState(false);
    const [selectedOrigin, setSelectedOrigin] = useState<any>(null);
    const [selectedDest, setSelectedDest] = useState<any>(null);
    const [selectedLoad, setSelectedLoad] = useState<any>(null);
    const [showGoodsDropdown, setShowGoodsDropdown] = useState(false);
    const [selectedGoods, setSelectedGoods] = useState<any>(null);

    const router = useRouter();

    // Filter locations based on search
    const filteredOrigins = LOCATIONS.filter(l => l.name.toLowerCase().includes(originSearch.toLowerCase()));
    const filteredDestinations = LOCATIONS.filter(l => l.name.toLowerCase().includes(destSearch.toLowerCase()));

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (selectedOrigin) params.append('origin', selectedOrigin.id);
        if (selectedDest) params.append('destination', selectedDest.id);
        if (selectedLoad) params.append('load', selectedLoad.id);
        if (selectedGoods) params.append('goods', selectedGoods.id);

        router.push(`/recommended-services?${params.toString()}`);
    };

    return (
        <div className="bg-[#3b669f] pb-24 pt-12 px-4 md:px-8 relative">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Where would you like to ship?</h1>
                <p className="text-blue-100 mb-6 text-sm">Start searching to compare, book and manage your freight, all on one platform</p>

                <div className="bg-white rounded-lg shadow-xl p-2 md:p-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200 relative z-30">
                    {/* Origin */}
                    <div className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer group relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Origin {selectedOrigin && <span className="text-green-500">✓</span>}</label>
                        <div className="flex items-center gap-2">
                            {!selectedOrigin ? (
                                <input
                                    type="text"
                                    placeholder="City or Port"
                                    className="w-full outline-none text-sm font-medium bg-transparent"
                                    value={originSearch}
                                    onChange={(e) => { setOriginSearch(e.target.value); setShowOriginDropdown(true); }}
                                    onFocus={() => setShowOriginDropdown(true)}
                                />
                            ) : (
                                <div className="flex items-center gap-2 w-full" onClick={() => { setSelectedOrigin(null); setOriginSearch(''); setTimeout(() => setShowOriginDropdown(true), 0); }}>
                                    <div className="w-5 h-4 bg-red-600 rounded-sm overflow-hidden relative border border-gray-200 flex-shrink-0">
                                        <div className="absolute top-0 left-0 text-[8px] text-yellow-300 px-0.5">★</div>
                                    </div>
                                    <div className="text-sm font-medium truncate text-gray-900">{selectedOrigin.name} | {selectedOrigin.country}</div>
                                </div>
                            )}
                        </div>
                        {showOriginDropdown && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-gray-100 max-h-60 overflow-y-auto z-50">
                                {filteredOrigins.map(loc => (
                                    <div
                                        key={loc.id}
                                        className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center gap-2"
                                        onClick={() => { setSelectedOrigin(loc); setShowOriginDropdown(false); }}
                                    >
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-900">{loc.name}, {loc.country}</span>
                                        <span className="text-xs text-gray-500 ml-auto">{loc.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Destination */}
                    <div className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer group relative">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Destination {selectedDest && <span className="text-green-500">✓</span>}</label>
                        <div className="flex items-center gap-2">
                            {!selectedDest ? (
                                <div className="flex items-center gap-2 w-full">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Where to?"
                                        className="w-full outline-none text-sm font-medium bg-transparent"
                                        value={destSearch}
                                        onChange={(e) => { setDestSearch(e.target.value); setShowDestDropdown(true); }}
                                        onFocus={() => setShowDestDropdown(true)}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 w-full" onClick={() => { setSelectedDest(null); setDestSearch(''); setTimeout(() => setShowDestDropdown(true), 0); }}>
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <div className="text-sm font-medium truncate text-gray-900">{selectedDest.name} | {selectedDest.country}</div>
                                </div>
                            )}
                        </div>
                        {showDestDropdown && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-gray-100 max-h-60 overflow-y-auto z-50">
                                {filteredDestinations.map(loc => (
                                    <div
                                        key={loc.id}
                                        className="p-2 hover:bg-blue-50 cursor-pointer text-sm flex items-center gap-2"
                                        onClick={() => { setSelectedDest(loc); setShowDestDropdown(false); }}
                                    >
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        <span className="text-gray-900">{loc.name}, {loc.country}</span>
                                        <span className="text-xs text-gray-500 ml-auto">{loc.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Load */}
                    <div
                        className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer relative group"
                        onClick={() => setLoadModalOpen(!loadModalOpen)}
                    >
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Load {selectedLoad && <span className="text-green-500">✓</span>}</label>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Package className="w-4 h-4" />
                            <span className="text-sm text-gray-800 font-medium">{selectedLoad ? selectedLoad.label : 'What are you shipping?'}</span>
                        </div>

                        {/* Load Popover */}
                        {loadModalOpen && (
                            <div className="absolute top-full left-0 mt-4 w-96 bg-white rounded-lg shadow-2xl z-50 border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                                <div className="absolute -top-2 left-8 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                                <h3 className="font-bold text-lg mb-4 text-gray-800">What are you shipping?</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {LOAD_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedLoad(type)}
                                                className={`border py-2 rounded text-sm font-medium transition ${selectedLoad?.id === type.id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-8 border border-gray-300 rounded px-3 py-2">
                                            <label className="block text-[10px] text-gray-500 uppercase">Dimensions</label>
                                            <input type="text" placeholder="L x W x H" className="w-full outline-none text-sm" />
                                        </div>
                                        <div className="col-span-4 border border-gray-300 rounded px-3 py-2 bg-gray-50">
                                            <select className="w-full bg-transparent outline-none text-sm">
                                                <option>CM</option>
                                                <option>IN</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
                                        onClick={() => setLoadModalOpen(false)}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Goods */}
                    <div
                        className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer group relative"
                        onClick={() => setShowGoodsDropdown(!showGoodsDropdown)}
                    >
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Goods {selectedGoods && <span className="text-green-500">✓</span>}</label>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Search className="w-4 h-4" />
                            <span className="text-sm text-gray-800 font-medium">{selectedGoods ? selectedGoods.label : 'Tell us about your goods'}</span>
                        </div>
                        {showGoodsDropdown && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-b-lg border border-gray-100 max-h-60 overflow-y-auto z-50">
                                {GOODS_TYPES.map(good => (
                                    <div
                                        key={good.id}
                                        className="p-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-900"
                                        onClick={() => { setSelectedGoods(good); setShowGoodsDropdown(false); }}
                                    >
                                        {good.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <div className="p-2 flex items-center justify-center">
                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform active:scale-95"
                        >
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
