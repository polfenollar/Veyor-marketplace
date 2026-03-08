import React, { useState } from 'react';
import { MOCK_QUOTES } from '../constants';
import { Quote } from '../types';
import { Truck, Ship, Plane, Info, Sliders, Calendar, Star, ChevronDown, MapPin } from 'lucide-react';

interface ResultsProps {
  onSelectQuote: (quote: Quote) => void;
  onBack: () => void;
}

export const Results: React.FC<ResultsProps> = ({ onSelectQuote, onBack }) => {
  const [activeTab, setActiveTab] = useState<'best' | 'quickest' | 'cheapest' | 'greenest'>('best');

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Search Summary Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between overflow-x-auto">
           <div className="flex items-center gap-6 text-sm whitespace-nowrap">
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-500">Origin</span>
                 <span className="font-medium flex items-center gap-1">Factory/Warehouse | <span className="text-lg">🇨🇳</span> China</span>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-500">Destination</span>
                 <span className="font-medium flex items-center gap-1">Business address | <span className="text-lg">🇬🇧</span> Thames Ditton</span>
              </div>
               <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-500">Load</span>
                 <span className="font-medium">1 Unit | Total: 0.96 cbm, 80 kg</span>
              </div>
               <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-500">Goods</span>
                 <span className="font-medium">$2,000 | Goods are ready</span>
              </div>
           </div>
           
           <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              <Sliders className="w-4 h-4" />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
           <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-gray-800">Top 2 Quotes</h3>
                 <Info className="w-4 h-4 text-gray-400" />
              </div>
              <div className="text-xs text-gray-500 mb-2">4 in total</div>
           </div>

           <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex justify-between cursor-pointer">
                 Price <ChevronDown className="w-4 h-4" />
              </h3>
              <div className="text-xs text-gray-500 mb-2">€489.38 - €1,806.4</div>
              <div className="relative h-1 bg-gray-200 rounded my-4">
                 <div className="absolute left-0 right-0 top-0 bottom-0 bg-blue-500 rounded"></div>
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"></div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"></div>
              </div>
           </div>

           <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4">Modes</h3>
              <div className="space-y-2">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                    <span className="text-sm text-gray-600">Express (3)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">LTL (1)</span>
                 </label>
              </div>
           </div>
        </aside>

        {/* Results List */}
        <div className="flex-1">
           {/* Tabs */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 flex divide-x divide-gray-100 overflow-hidden">
              <button 
                onClick={() => setActiveTab('best')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'best' ? 'bg-sky-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                 Best value · 4-4 days · €489
              </button>
              <button 
                onClick={() => setActiveTab('quickest')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'quickest' ? 'bg-sky-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                 Quickest · 2-2 days · €1,806
              </button>
              <button 
                onClick={() => setActiveTab('cheapest')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'cheapest' ? 'bg-sky-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                 Cheapest · 4-4 days · €489
              </button>
               <button 
                onClick={() => setActiveTab('greenest')}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${activeTab === 'greenest' ? 'bg-sky-50 text-blue-700 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                 Greenest · 4-4 days · €489
              </button>
           </div>

           {/* Cards */}
           <div className="space-y-4">
              {MOCK_QUOTES.map((quote) => (
                 <div key={quote.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all hover:shadow-md hover:border-blue-300 relative">
                    {/* Tags */}
                    {quote.tags.length > 0 && (
                       <div className="absolute top-0 left-0 flex">
                          {quote.tags.includes('Best value') && (
                             <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-tl-lg rounded-br-lg">Best value</span>
                          )}
                          {quote.tags.includes('Quickest') && (
                             <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-tl-lg rounded-br-lg">Quickest</span>
                          )}
                           {quote.tags.includes('Guaranteed capacity') && (
                             <span className="bg-purple-700 text-white text-xs font-bold px-3 py-1 rounded-tl-lg rounded-br-lg">Guaranteed capacity</span>
                          )}
                       </div>
                    )}

                    <div className="flex flex-col md:flex-row justify-between items-start mt-4">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                             {quote.mode === 'truck' ? <Truck className="w-4 h-4" /> : quote.mode === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
                             <span>{quote.mode === 'express' ? 'Express' : quote.mode.charAt(0).toUpperCase() + quote.mode.slice(1)}</span>
                             <span className="text-gray-300">|</span>
                             <span>Est. {quote.minDays}-{quote.maxDays} days</span>
                             <Info className="w-3 h-3 text-gray-400" />
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                             <div className="text-sm text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {quote.route.originCode}, Moià
                             </div>
                             <div className="flex items-center gap-1 text-gray-300">
                                <div className="h-px w-8 bg-gray-300"></div>
                                {quote.mode === 'truck' ? <Truck className="w-3 h-3" /> : <Plane className="w-3 h-3" />}
                                <div className="h-px w-8 bg-gray-300"></div>
                             </div>
                             <div className="text-sm text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                {quote.route.destinationCode}, Thames Ditton
                             </div>
                          </div>

                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-600 border border-gray-200">
                                {quote.providerName.substring(0, 2).toUpperCase()}
                             </div>
                             <span className="text-sm font-medium text-gray-700">{quote.providerName}</span>
                             <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                   <Star key={i} className={`w-3 h-3 ${i < Math.floor(quote.rating) ? 'fill-blue-500 text-blue-500' : 'text-gray-300'}`} />
                                ))}
                                <span className="text-xs text-blue-500 ml-1">({quote.reviewCount})</span>
                             </div>
                          </div>
                       </div>

                       <div className="mt-6 md:mt-0 flex flex-col items-end">
                          <div className="text-2xl font-bold text-gray-900 mb-2">
                             {quote.currency === 'EUR' ? '€' : '$'}
                             {quote.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                             <span className="text-xs font-normal align-top ml-0.5">30</span>
                          </div>
                          <button 
                             onClick={() => onSelectQuote(quote)}
                             className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-8 rounded shadow-sm transition-colors"
                          >
                             Select
                          </button>
                          <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                             <Calendar className="w-3 h-3" /> Rate expires: Nov 30, 2025
                          </div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           
           <div className="mt-8 text-center text-gray-500">
             2 More Quotes from all providers
           </div>
        </div>
      </div>
    </div>
  );
};