
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
        <div
            className="relative px-4 pt-16 pb-28 md:px-8 md:pt-20 md:pb-32"
            style={{ background: 'linear-gradient(135deg, var(--hero-bg) 0%, var(--hero-bg-end) 100%)' }}
        >
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} aria-hidden />
            <div className="max-w-6xl mx-auto relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-inverse)] mb-3">Where would you like to ship?</h1>
                <p className="text-white/80 text-base md:text-lg mb-8 md:mb-10 max-w-xl">Compare, book and manage freight in one place.</p>

                <div className="bg-[var(--surface)] rounded-2xl shadow-lg border border-[var(--border)] p-4 md:p-5 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[var(--border)] relative z-30 gap-0">
                    {/* Origin */}
                    <div className="flex-1 p-4 md:p-3 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer group relative rounded-lg md:rounded-none">
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1 group-hover:text-[var(--accent)]">Origin {selectedOrigin && <span className="text-[var(--accent)]">✓</span>}</label>
                        <div className="flex items-center gap-2">
                            {!selectedOrigin ? (
                                <input
                                    type="text"
                                    placeholder="City or Port"
                                    className="w-full outline-none text-sm font-medium bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-1"
                                    value={originSearch}
                                    onChange={(e) => { setOriginSearch(e.target.value); setShowOriginDropdown(true); }}
                                    onFocus={() => setShowOriginDropdown(true)}
                                    aria-label="Origin city or port"
                                />
                            ) : (
                                <div className="flex items-center gap-2 w-full" onClick={() => { setSelectedOrigin(null); setOriginSearch(''); setTimeout(() => setShowOriginDropdown(true), 0); }}>
                                    <div className="w-5 h-4 bg-red-600 rounded-sm overflow-hidden relative border border-[var(--border)] flex-shrink-0">
                                        <div className="absolute top-0 left-0 text-[8px] text-yellow-300 px-0.5">★</div>
                                    </div>
                                    <div className="text-sm font-medium truncate text-[var(--text-primary)]">{selectedOrigin.name} | {selectedOrigin.country}</div>
                                </div>
                            )}
                        </div>
                        {showOriginDropdown && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[var(--surface)] shadow-xl rounded-lg border border-[var(--border)] max-h-60 overflow-y-auto z-50">
                                {filteredOrigins.map(loc => (
                                    <div
                                        key={loc.id}
                                        className="p-3 hover:bg-[var(--accent-muted)] cursor-pointer text-sm flex items-center gap-2 focus-visible:bg-[var(--accent-muted)]"
                                        onClick={() => { setSelectedOrigin(loc); setShowOriginDropdown(false); }}
                                    >
                                        <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                                        <span className="text-[var(--text-primary)]">{loc.name}, {loc.country}</span>
                                        <span className="text-xs text-[var(--text-muted)] ml-auto">{loc.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Destination */}
                    <div className="flex-1 p-4 md:p-3 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer group relative rounded-lg md:rounded-none">
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1 group-hover:text-[var(--accent)]">Destination {selectedDest && <span className="text-[var(--accent)]">✓</span>}</label>
                        <div className="flex items-center gap-2">
                            {!selectedDest ? (
                                <div className="flex items-center gap-2 w-full">
                                    <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
                                    <input
                                        type="text"
                                        placeholder="Where to?"
                                        className="w-full outline-none text-sm font-medium bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] rounded focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-1"
                                        value={destSearch}
                                        onChange={(e) => { setDestSearch(e.target.value); setShowDestDropdown(true); }}
                                        onFocus={() => setShowDestDropdown(true)}
                                        aria-label="Destination city or port"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 w-full" onClick={() => { setSelectedDest(null); setDestSearch(''); setTimeout(() => setShowDestDropdown(true), 0); }}>
                                    <MapPin className="w-4 h-4 text-[var(--accent)]" />
                                    <div className="text-sm font-medium truncate text-[var(--text-primary)]">{selectedDest.name} | {selectedDest.country}</div>
                                </div>
                            )}
                        </div>
                        {showDestDropdown && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[var(--surface)] shadow-xl rounded-lg border border-[var(--border)] max-h-60 overflow-y-auto z-50">
                                {filteredDestinations.map(loc => (
                                    <div
                                        key={loc.id}
                                        className="p-3 hover:bg-[var(--accent-muted)] cursor-pointer text-sm flex items-center gap-2"
                                        onClick={() => { setSelectedDest(loc); setShowDestDropdown(false); }}
                                    >
                                        <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                                        <span className="text-[var(--text-primary)]">{loc.name}, {loc.country}</span>
                                        <span className="text-xs text-[var(--text-muted)] ml-auto">{loc.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Load */}
                    <div
                        role="button"
                        tabIndex={0}
                        aria-label={selectedLoad ? `Load: ${selectedLoad.label}. Click to change.` : 'Select load type'}
                        className="flex-1 p-4 md:p-3 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer relative group rounded-lg md:rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                        onClick={() => setLoadModalOpen(!loadModalOpen)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLoadModalOpen(!loadModalOpen); } }}
                    >
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1 group-hover:text-[var(--accent)]">Load {selectedLoad && <span className="text-[var(--accent)]">✓</span>}</label>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <Package className="w-4 h-4" />
                            <span className="text-sm text-[var(--text-primary)] font-medium">{selectedLoad ? selectedLoad.label : 'What are you shipping?'}</span>
                        </div>

                        {/* Load Popover */}
                        {loadModalOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full md:w-96 bg-[var(--surface)] rounded-xl shadow-2xl z-50 border border-[var(--border)] p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="absolute -top-2 left-8 w-4 h-4 bg-[var(--surface)] transform rotate-45 border-t border-l border-[var(--border)]"></div>
                                <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">What are you shipping?</h3>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        {LOAD_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedLoad(type)}
                                                className={`border py-2 rounded-lg text-sm font-medium transition ${selectedLoad?.id === type.id ? 'border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent-hover)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-muted)]'}`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-8 border border-[var(--border)] rounded-lg px-3 py-2">
                                            <label className="block text-[10px] text-[var(--text-muted)] uppercase">Dimensions</label>
                                            <input type="text" placeholder="L x W x H" className="w-full outline-none text-sm text-[var(--text-primary)]" />
                                        </div>
                                        <div className="col-span-4 border border-[var(--border)] rounded-lg px-3 py-2 bg-[var(--surface-muted)]">
                                            <select className="w-full bg-transparent outline-none text-sm text-[var(--text-primary)]">
                                                <option>CM</option>
                                                <option>IN</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-[var(--accent)] text-white font-medium py-2 rounded-lg hover:bg-[var(--accent-hover)] transition focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
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
                        role="button"
                        tabIndex={0}
                        aria-label={selectedGoods ? `Goods: ${selectedGoods.label}. Click to change.` : 'Select goods type'}
                        className="flex-1 p-4 md:p-3 hover:bg-[var(--surface-muted)] transition-colors cursor-pointer relative group rounded-lg md:rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                        onClick={() => setShowGoodsDropdown(!showGoodsDropdown)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowGoodsDropdown(!showGoodsDropdown); } }}
                    >
                        <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1 group-hover:text-[var(--accent)]">Goods {selectedGoods && <span className="text-[var(--accent)]">✓</span>}</label>
                        <div className="flex items-center gap-2 text-[var(--text-muted)]">
                            <Search className="w-4 h-4" />
                            <span className="text-sm text-[var(--text-primary)] font-medium">{selectedGoods ? selectedGoods.label : 'Tell us about your goods'}</span>
                        </div>
                        {showGoodsDropdown && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[var(--surface)] shadow-xl rounded-lg border border-[var(--border)] max-h-60 overflow-y-auto z-50">
                                {GOODS_TYPES.map(good => (
                                    <div
                                        key={good.id}
                                        className="p-3 hover:bg-[var(--accent-muted)] cursor-pointer text-sm text-[var(--text-primary)]"
                                        onClick={() => { setSelectedGoods(good); setShowGoodsDropdown(false); }}
                                    >
                                        {good.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search Button */}
                    <div className="pt-4 md:pt-0 md:pl-2 flex items-center justify-center md:justify-center">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="w-full md:w-auto bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl px-6 py-3.5 shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 font-medium focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2"
                            aria-label="Search freight quotes"
                        >
                            <Search className="w-5 h-5 flex-shrink-0" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
