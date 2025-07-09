"use client"
import { Search, Bell, User, Menu, X } from "lucide-react"

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center space-x-3">
             <img
              src="data:image/png;base64,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"
              alt="IT ROAD GROUP"
              className="h-16 w-auto"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-64">
            <Search size={16} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="bg-transparent outline-none text-sm flex-1 text-gray-700"
            />
          </div>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              3
            </span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <span className="text-sm font-medium text-gray-700">Admin</span>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
