import React, { useState } from 'react';
import { Quote } from '../types';
import { ChevronDown, MapPin, Truck, AlertCircle, User, HelpCircle, FileText, Upload, Image as ImageIcon } from 'lucide-react';

interface BookingProps {
  quote: Quote;
  onBack: () => void;
}

type BookingSection = 'pickup' | 'commodities' | 'billing';

export const Booking: React.FC<BookingProps> = ({ quote, onBack }) => {
  const [activeSection, setActiveSection] = useState<BookingSection>('pickup');

  // Helper to render the correct form based on activeSection
  const renderFormContent = () => {
    switch (activeSection) {
      case 'commodities':
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Commodities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Product name</label>
                <input type="text" placeholder="Add product name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">SKU (Optional)</label>
                <input type="text" placeholder="Enter SKU" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <label className="text-xs font-bold text-gray-700">Detailed product description (Optional)</label>
              <textarea 
                placeholder="Describe what your goods are and what they're made of. Include any brand and model numbers. For example, '100% cotton woven men's t-shirt' not 'cotton t-shirt'."
                rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none resize-y"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">End-use of product (Optional)</label>
                <input type="text" placeholder="Describe how the product will be used" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Country of manufacture (Optional)</label>
                <div className="relative">
                   <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none appearance-none bg-white">
                     <option>🇨🇳 China</option>
                     <option>🇺🇸 United States</option>
                     <option>🇬🇧 United Kingdom</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Product URL (Optional)</label>
                <input type="text" placeholder="Enter URL" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">HS/HTS code (Optional)</label>
                <input type="text" placeholder="Enter HT/HTS code" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="mb-8">
               <label className="text-xs font-bold text-gray-700 mb-2 block">Supporting documents and images (Optional)</label>
               <p className="text-xs text-gray-500 mb-3">Adding additional documents such as product specs, FDA data sheets, permits, government agency forms, and photographs will help your customs broker classify your product more accurately.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                     <ImageIcon className="w-8 h-8 text-gray-600" />
                     <div>
                        <div className="font-bold text-sm text-gray-700">Upload your product image</div>
                        <div className="text-xs text-gray-500">File shouldn't exceed 7 MB</div>
                     </div>
                  </div>
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 flex items-center gap-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                     <FileText className="w-8 h-8 text-gray-600" />
                     <div>
                        <div className="font-bold text-sm text-gray-700">Upload your Doc</div>
                        <div className="text-xs text-gray-500">File shouldn't exceed 7 MB</div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button className="text-blue-600 text-sm font-medium hover:underline">What can I ship?</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-medium transition-colors">Save</button>
            </div>
          </>
        );

      case 'billing':
        return (
           <>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Company Billing Details</h2>
            
            <div className="space-y-1 mb-6">
                <label className="text-xs font-bold text-gray-700">Full name</label>
                <input type="text" placeholder="Enter full name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                <p className="text-xs text-gray-400">Required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Company name</label>
                <input type="text" placeholder="Enter company name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                <p className="text-xs text-gray-400">Required</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Phone</label>
                 <div className="flex">
                    <div className="border border-gray-300 border-r-0 rounded-l px-3 bg-gray-50 text-gray-500 flex items-center">
                        <User className="w-4 h-4" />
                        <ChevronDown className="w-3 h-3 ml-1" />
                    </div>
                    <input type="tel" placeholder="+x (xxx) xxx-xxxx" className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Doing business as (Optional)</label>
                <input type="text" placeholder="Enter business name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">VAT/Tax ID (Optional)</label>
                <input type="text" placeholder="Enter VAT/Tax ID" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="space-y-1 mb-6">
               <label className="text-xs font-bold text-gray-700">Company billing address</label>
               <input type="text" placeholder="Enter full street address or PO box" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
               <p className="text-xs text-gray-400">Required</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">City</label>
                <input type="text" placeholder="Enter city" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                 <p className="text-xs text-gray-400">Required</p>
              </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">State/Region (Optional)</label>
                <input type="text" placeholder="Enter state/region" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Zip code (Optional)</label>
                <input type="text" placeholder="Enter zip code" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
               <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Country</label>
                <input type="text" placeholder="Enter country" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>
           </>
        );

      case 'pickup':
      default:
        return (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pickup</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Company name</label>
                <input type="text" placeholder="Enter company name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Full name</label>
                <input type="text" placeholder="Enter first & last name" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email</label>
                <input type="email" placeholder="Enter email address" className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Phone</label>
                <div className="flex">
                  <button className="border border-gray-300 border-r-0 rounded-l px-3 bg-gray-50 text-gray-500 hover:bg-gray-100">
                    <User className="w-4 h-4" />
                  </button>
                  <input type="tel" placeholder="+x (xxx) xxx-xxxx" className="w-full border border-gray-300 rounded-r px-3 py-2 text-sm focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <label className="text-xs font-bold text-gray-700">Street address</label>
              <input type="text" placeholder="Street, Number, PO Box, Apartment, Suite, Unit, Building, Floor, Etc." className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">City</label>
                <input type="text" value="Moià" readOnly className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">State (Optional)</label>
                <input type="text" value="Catalunya" readOnly className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Country / Region</label>
                <input type="text" value="Spain" readOnly className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Zip code (Optional)</label>
                <input type="text" value="08180" readOnly className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-500 outline-none" />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Use these contact details for your consignor? <HelpCircle className="w-4 h-4 inline text-gray-400" /></label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="consignor_contact" className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="consignor_contact" className="w-4 h-4 text-blue-600" defaultChecked />
                  <span className="text-sm">No</span>
                </label>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button className="text-blue-600 text-sm font-medium hover:underline">What can I ship?</button>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded font-medium transition-colors">Save</button>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Main Form Area */}
        <div className="flex-1 space-y-4">
          
          {/* Alert Banner */}
          <div className="bg-white border-l-4 border-red-500 rounded shadow-sm p-4 flex gap-4">
             <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
             <div>
                <h3 className="font-bold text-gray-900">Your account has been restricted</h3>
                <p className="text-sm text-gray-600 mt-1">As such, this shipment cannot be processed. Please contact us via chat or email ship@VEYOR.com for more information.</p>
             </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Truck className="w-8 h-8" />
             </div>
             <h2 className="text-2xl font-bold text-gray-800 mb-2">Your shipment is almost ready to go!</h2>
             <p className="text-gray-500">Fill in the required information below so the logistics provider can process your shipment.</p>
          </div>

           {/* Shipment Route Summary Inline */}
           <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-700">
                 <Truck className="w-4 h-4 text-gray-400" />
                 <span>Door To Door</span>
                 <span className="font-medium">Moià, Spain</span>
                 <span className="text-gray-300">o——o</span>
                 <span className="font-medium">Thames Ditton, United Kingdom</span>
              </div>
              <button onClick={onBack} className="text-blue-600 text-sm font-medium hover:underline">Cancel shipment</button>
           </div>

           <div className="flex flex-col md:flex-row gap-6">
              {/* Vertical Navigation */}
              <nav className="w-full md:w-64 flex-shrink-0 space-y-1">
                 <div className="space-y-1">
                    <button className="w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center text-gray-600 hover:bg-gray-50">
                       Payments <ChevronDown className="w-4 h-4" />
                    </button>
                    <button 
                       onClick={() => setActiveSection('billing')}
                       className={`w-full text-left px-8 py-2 text-sm font-medium transition-colors ${activeSection === 'billing' ? 'text-blue-700 bg-sky-50 rounded border-l-4 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                       Payment method
                    </button>
                 </div>
                 
                 <button className="w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center text-gray-600 hover:bg-gray-50">
                    Contact details <ChevronDown className="w-4 h-4" />
                 </button>
                 
                 <button 
                    onClick={() => setActiveSection('pickup')}
                    className={`w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center transition-colors ${activeSection === 'pickup' ? 'bg-sky-50 text-blue-700 border-l-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                 >
                    Pickup
                 </button>
                 
                 <button className="w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center text-gray-600 hover:bg-gray-50">
                    Consignor
                 </button>
                 <button className="w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center text-gray-600 hover:bg-gray-50">
                    Delivery
                 </button>
                 <button className="w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center text-gray-600 hover:bg-gray-50">
                    Consignee
                 </button>

                 <div className="space-y-1">
                    <button className="w-full text-left px-4 py-3 rounded text-sm font-medium flex justify-between items-center text-gray-600 hover:bg-gray-50">
                       Your Goods <ChevronDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setActiveSection('commodities')}
                      className={`w-full text-left px-8 py-2 text-sm font-medium transition-colors ${activeSection === 'commodities' ? 'text-blue-700 bg-sky-50 rounded border-l-4 border-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                    >
                       Commodities
                    </button>
                    <button className="w-full text-left px-8 py-2 text-sm font-medium text-gray-500 hover:text-gray-800">
                       Upload documents
                    </button>
                 </div>
              </nav>

              {/* Form Content */}
              <div className="flex-1 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                 {renderFormContent()}
              </div>
           </div>
        </div>

        {/* Right Sidebar: Booking Summary */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Summary</h3>
              
              <div className="flex items-center justify-between mb-8 px-2">
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mb-1">
                       <Truck className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-[10px] text-gray-500 text-center leading-tight">Parc del Tenor<br/>Viñas, Av. de...</span>
                 </div>
                 <div className="flex-1 h-px bg-gray-300 mx-2 relative top-[-10px]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                       <Truck className="w-4 h-4 text-gray-400" />
                    </div>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mb-1">
                       <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-[10px] text-gray-500 text-center leading-tight">Thames Ditton,<br/>UK</span>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 border-b border-gray-100 pb-6">
                 <div className="text-center">
                    <Truck className="w-6 h-6 text-gray-500 mx-auto mb-1" />
                    <div className="font-bold text-gray-800 text-sm">LTL</div>
                    <div className="text-xs text-gray-500">Door to door</div>
                 </div>
                 <div className="text-center border-l border-gray-100">
                    <div className="font-bold text-gray-800 text-sm">4-4 days</div>
                    <div className="text-xs text-gray-500">Est. transit</div>
                 </div>
              </div>

              <div className="mb-6 border-b border-gray-100 pb-6">
                 <h4 className="text-sm font-bold text-gray-700 mb-3">Load</h4>
                 <div className="flex items-center justify-center">
                    <div className="text-center">
                       <div className="font-bold text-2xl text-gray-800">1 <span className="text-sm font-normal text-gray-400">×</span></div>
                       <div className="text-xs font-bold text-gray-600 uppercase">Pallets</div>
                       <div className="text-[10px] text-gray-400">120 x 80 x 100 cm</div>
                    </div>
                 </div>
                 <div className="text-center mt-4">
                    <div className="inline-block border border-gray-300 rounded px-2 py-1 text-xs font-bold text-gray-600">
                       80.00 KG <span className="font-normal text-gray-400">0.96 CBM</span>
                    </div>
                 </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-bold text-gray-500">Seller: <span className="text-gray-800 font-normal">Haulable</span></span>
                 <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>

              <div className="bg-sky-50 p-4 rounded text-sm text-gray-700 italic border border-sky-100 mb-6">
                 "Could not be happier First time with Haulable but will not be the last."
                 <div className="not-italic font-bold text-xs mt-2">PAUL VERNON, USA</div>
                 <div className="flex text-yellow-400 text-xs mt-1">★★★★★</div>
              </div>
           </div>

           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Price details</h3>
              
              <div className="space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-600">Seller's Quote</span>
                    <span className="font-medium">€365.64</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Customs brokerage</span>
                    <span className="font-medium">€84.90</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Duties and taxes</span>
                    <span className="font-medium text-gray-500 flex items-center gap-1"><HelpCircle className="w-3 h-3" /> Not Included</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-600">Insurance</span>
                    <span className="font-medium">€38.84</span>
                 </div>
                 <div className="text-[10px] text-gray-400 text-right">Based on value of $2,000.00</div>
                 
                 <div className="border-t border-gray-100 my-2"></div>
                 
                 <div className="flex justify-between text-blue-600 cursor-pointer hover:underline">
                    <span>Add a promo code</span>
                 </div>
                 
                 <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center gap-1">Platform fee <HelpCircle className="w-3 h-3" /></span>
                    <span className="font-medium">€7.34</span>
                 </div>
                 
                 <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline mt-2">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">€496.72</span>
                 </div>
              </div>
           </div>
        </aside>

        {/* Tips Sidebar (Fixed Bottom Right Widget) */}
         <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-4 flex items-center gap-3 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 cursor-pointer hover:shadow-xl transition-shadow">
               <div className="w-10 h-10 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold relative">
                  C
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">1</div>
               </div>
               <div>
                  <div className="font-bold text-gray-800 text-sm">Tips for reducing extra charges</div>
                  <div className="text-xs text-gray-500">5 steps • About 5 minutes</div>
                  <div className="w-full h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                     <div className="h-full w-1/5 bg-teal-500"></div>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
};