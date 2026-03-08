import React, { useState } from 'react';
import { Search, MapPin, Package, Calendar, ArrowRight, Ship, Truck, FileText, CreditCard } from 'lucide-react';
import { Location } from '../types';

interface HomeProps {
  onSearch: () => void;
}

export const Home: React.FC<HomeProps> = ({ onSearch }) => {
  const [loadModalOpen, setLoadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Search Section */}
      <div className="bg-[#3b669f] pb-24 pt-12 px-4 md:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Where would you like to ship?</h1>
          <p className="text-blue-100 mb-6 text-sm">Start searching to compare, book and manage your freight, all on one platform</p>
          
          <div className="bg-white rounded-lg shadow-xl p-2 md:p-4 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* Origin */}
            <div className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Origin <span className="text-green-500">✓</span></label>
              <div className="flex items-center gap-2">
                 <div className="w-5 h-4 bg-red-600 rounded-sm overflow-hidden relative border border-gray-200 flex-shrink-0">
                    <div className="absolute top-0 left-0 text-[8px] text-yellow-300 px-0.5">★</div>
                 </div>
                 <div className="text-sm font-medium truncate">Factory/Warehouse | China</div>
              </div>
            </div>

            {/* Destination */}
            <div className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Destination</label>
              <div className="flex items-center gap-2 text-gray-400">
                 <MapPin className="w-4 h-4" />
                 <span className="text-sm">Where are you shipping to?</span>
              </div>
            </div>

            {/* Load */}
            <div 
              className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer relative group"
              onClick={() => setLoadModalOpen(!loadModalOpen)}
            >
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Load</label>
              <div className="flex items-center gap-2 text-gray-400">
                 <Package className="w-4 h-4" />
                 <span className="text-sm">What are you shipping?</span>
              </div>

              {/* Load Popover */}
              {loadModalOpen && (
                <div className="absolute top-full left-0 mt-4 w-96 bg-white rounded-lg shadow-2xl z-20 border border-gray-100 p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="absolute -top-2 left-8 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                   <h3 className="font-bold text-lg mb-4 text-gray-800">What are you shipping?</h3>
                   <div className="flex gap-4 border-b border-gray-100 pb-4 mb-4">
                      <button className="flex-1 py-2 text-blue-600 border-b-2 border-blue-600 font-medium text-sm flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" /> Loose Cargo
                      </button>
                      <button className="flex-1 py-2 text-gray-500 font-medium text-sm flex items-center justify-center gap-2 hover:text-gray-700">
                        <div className="w-4 h-4 border border-current rounded-sm"></div> Containers
                      </button>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <button className="border border-blue-200 bg-blue-50 text-blue-700 py-2 rounded text-sm font-medium hover:bg-blue-100 transition">Pallets</button>
                        <button className="border border-gray-200 text-gray-600 py-2 rounded text-sm font-medium hover:bg-gray-50 transition">Boxes/Crates</button>
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
                        className="w-full bg-transparent border border-blue-600 text-blue-600 font-medium py-2 rounded hover:bg-blue-50 transition"
                        onClick={(e) => { e.stopPropagation(); setLoadModalOpen(false); }}
                      >
                         Confirm
                      </button>
                   </div>
                </div>
              )}
            </div>

            {/* Goods */}
            <div className="flex-1 p-3 hover:bg-gray-50 transition-colors cursor-pointer group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 group-hover:text-blue-600">Goods</label>
              <div className="flex items-center gap-2 text-gray-400">
                 <Search className="w-4 h-4" />
                 <span className="text-sm">Tell us about your goods</span>
              </div>
            </div>

             {/* Search Button */}
            <div className="p-2 flex items-center justify-center">
               <button 
                onClick={onSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform active:scale-95"
               >
                 <Search className="w-6 h-6" />
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto w-full px-4 md:px-8 -mt-10 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Card 1 */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                 <Ship className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Manage your shipments</h3>
              <p className="text-sm text-gray-500 mb-6 flex-1">
                 Once you make your first booking, we make it easy to manage your shipment.
              </p>
              <div className="space-y-3 w-full">
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-purple-200"></span> Booked
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-yellow-200"></span> In transit
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-200"></span> Delivered
                 </div>
              </div>
              <button className="mt-6 w-full py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition">
                 Book your first shipment
              </button>
           </div>

           {/* Card 2 */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
                 <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Manage your payments</h3>
              <p className="text-sm text-gray-500 mb-6 flex-1">
                 Once you book a shipment, stay up-to-date on your bills and payments.
              </p>
              <div className="space-y-3 w-full">
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-purple-200"></span> Open
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-yellow-200"></span> Payment due
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-200"></span> Paid in full
                 </div>
              </div>
           </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 mb-4">
                 <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">VEYOR credit</h3>
              <p className="text-sm text-gray-500 mb-6 flex-1">
                 Based in the US, UK, or Canada? Has your business been running for at least 1 year? Take advantage of our generous credit terms.
              </p>
              <button className="mt-auto w-full py-2 bg-transparent text-blue-600 font-medium text-sm hover:underline text-left px-0">
                 Contact support
              </button>
              <button className="mt-2 w-full py-2 border border-blue-600 text-blue-600 font-medium rounded hover:bg-blue-50 transition">
                 Get started
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
