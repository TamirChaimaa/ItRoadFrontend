import React from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <svg width="60" height="40" viewBox="0 0 200 100" className="mr-2">
                <path d="M20 30 L60 30 L60 20 L80 20" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <path d="M60 30 L60 40 L40 40 L40 60 L20 60" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <path d="M80 20 L80 10 L100 10" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <path d="M80 20 L100 20 L100 30 L120 30" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <path d="M100 30 L100 40 L80 40 L80 60 L100 60" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <path d="M120 30 L140 30 L140 20 L160 20" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <path d="M140 30 L140 40 L120 40 L120 60 L140 60" stroke="#06b6d4" strokeWidth="3" fill="none"/>
                <circle cx="20" cy="30" r="3" fill="#06b6d4"/>
                <circle cx="60" cy="30" r="3" fill="#06b6d4"/>
                <circle cx="80" cy="20" r="3" fill="#06b6d4"/>
                <circle cx="100" cy="10" r="3" fill="#06b6d4"/>
                <circle cx="100" cy="30" r="3" fill="#06b6d4"/>
                <circle cx="120" cy="30" r="3" fill="#06b6d4"/>
                <circle cx="140" cy="30" r="3" fill="#06b6d4"/>
                <circle cx="160" cy="20" r="3" fill="#06b6d4"/>
                <circle cx="20" cy="60" r="3" fill="#06b6d4"/>
                <circle cx="100" cy="60" r="3" fill="#06b6d4"/>
                <circle cx="140" cy="60" r="3" fill="#06b6d4"/>
              </svg>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-black">IT</span>
                <span className="text-2xl font-bold text-cyan-500 ml-1">ROAD</span>
                <div className="ml-2">
                  <span className="text-sm font-bold text-gray-600 block leading-tight">GROUP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
