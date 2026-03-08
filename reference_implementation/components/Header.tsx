import React from 'react';
import { Search, Globe, HelpCircle, Menu, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6 sticky top-0 z-50">
      <div className="flex items-center gap-2 mr-8">
        <div className="text-blue-900 font-bold text-xl tracking-tight flex items-center gap-1">
          <div className="w-6 h-6 bg-blue-500 rounded-sm relative">
             <div className="absolute top-1 left-1 w-2 h-2 bg-white/80"></div>
             <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/80"></div>
          </div>
          VEYOR
        </div>
      </div>

      <div className="flex-1 hidden md:flex items-center">
        <div className="relative">
           <span className="text-gray-500 font-medium text-sm hover:text-blue-600 cursor-pointer transition-colors">Find a Quote</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-blue-600 font-medium text-sm">
           <Globe className="w-4 h-4" />
           <span>EN</span>
        </button>
        <button className="text-gray-600 hover:text-blue-600">
           <HelpCircle className="w-5 h-5" />
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-colors">
            Refer a friend
        </button>
        <div className="flex items-center gap-2 border-l border-gray-300 pl-4 ml-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs">P</div>
            <Menu className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>
      </div>
    </header>
  );
};
