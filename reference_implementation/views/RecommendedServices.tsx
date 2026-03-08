import React, { useState } from 'react';
import { Info, HelpCircle } from 'lucide-react';

interface RecommendedServicesProps {
  onConfirm: () => void;
}

export const RecommendedServices: React.FC<RecommendedServicesProps> = ({ onConfirm }) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Summary Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center gap-6 text-sm overflow-x-auto">
           <div className="flex flex-col whitespace-nowrap">
              <span className="text-xs font-bold text-gray-500">Origin</span>
              <span className="font-medium flex items-center gap-1">Business address | <span className="text-lg">🇪🇸</span> Parque del Tenor Viñas,...</span>
           </div>
           <div className="h-8 w-px bg-gray-200 flex-shrink-0"></div>
           <div className="flex flex-col whitespace-nowrap">
              <span className="text-xs font-bold text-gray-500">Destination</span>
              <span className="font-medium flex items-center gap-1">Business address | <span className="text-lg">🇬🇧</span> Thames Ditton, UK</span>
           </div>
            <div className="h-8 w-px bg-gray-200 flex-shrink-0"></div>
           <div className="flex flex-col whitespace-nowrap">
              <span className="text-xs font-bold text-gray-500">Load</span>
              <span className="font-medium">1 Unit | Total: 0.96 cbm, 80 kg</span>
           </div>
            <div className="h-8 w-px bg-gray-200 flex-shrink-0"></div>
           <div className="flex flex-col whitespace-nowrap">
              <span className="text-xs font-bold text-gray-500">Goods</span>
              <span className="font-medium">$2,000 | Goods are ready</span>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Recommended Services</h2>
        <p className="text-gray-600 mb-8">We've selected all the services you need to ship your goods from a <span className="font-bold">Business address</span> to a <span className="font-bold">Business address</span>. Please check and confirm before getting your results.</p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Column */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Liftgate</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-gray-700 font-medium">Yes - Add a liftgate at pickup</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-gray-700 font-medium">Yes - Add a liftgate at delivery</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  Insurance <HelpCircle className="w-4 h-4 text-gray-400" />
                </h3>
                <div className="flex items-start gap-3">
                  <label className="relative inline-flex items-center cursor-pointer mt-1">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <div className="flex-1">
                     <span className="text-gray-700 font-medium block">Yes - (covers the combined value of goods and initial freight costs up to $500k)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
               <div>
                <h3 className="text-lg font-bold text-gray-700 mb-4">Customs brokerage</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-gray-700 font-medium flex items-center gap-1">Yes - I need customs brokerage <HelpCircle className="w-4 h-4 text-gray-400" /></span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="text-gray-500 font-medium flex items-center gap-1">I'm not a known shipper <HelpCircle className="w-4 h-4 text-gray-400" /></span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={onConfirm}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-8 rounded shadow transition-colors text-lg"
          >
            Confirm Services & Get Results
          </button>
        </div>
      </div>
    </div>
  );
};