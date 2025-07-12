import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { Home, FileText, Plus, Users, Settings, LogOut } from "lucide-react";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle logout logic
  const handleLogout = async () => {
    await dispatch(logoutUser());   // Clears auth cookies and updates the Redux store
    navigate("/");                  // Redirects the user to the home or login page
  };

  // Define the navigation menu items
  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/dashboard/documents", label: "Documents", icon: FileText },
    { path: "/dashboard/add-document", label: "Add Document", icon: Plus },
    { path: "/dashboard/users", label: "Users", icon: Users },
    { path: "/dashboard/profile", label: "Profile", icon: Settings },
  ];

  return (
    <aside
      className={`bg-white border-r border-gray-200 w-64 shadow-lg z-30 lg:static transition-all duration-300 ${
        isOpen ? "block" : "hidden"
      } lg:block`}
    >
      <div className="h-full flex flex-col">

        {/* Logo Section */}
        <div className="flex items-center justify-center space-x-3 mt-5">
          <img
            src="data:image/png;base64,..."
            alt="IT ROAD GROUP"
            className="h-16 w-auto"
          />
        </div>

        <hr className="my-4 border-t border-gray-200" />

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                location.pathname === path
                  ? "bg-cyan-50 text-cyan-700 border-r-3 border-cyan-500 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`mr-3 transition-all duration-200 ${
                  location.pathname === path
                    ? "text-cyan-600 scale-110"
                    : "text-gray-400 group-hover:text-gray-600 group-hover:scale-105"
                }`}
                size={20}
              />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 group"
          >
            <LogOut
              className="mr-3 group-hover:scale-105 transition-transform duration-200"
              size={20}
            />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
