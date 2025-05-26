import { Menu, Bell, Search } from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  openSidebar: () => void;
}

const AdminHeader = ({ openSidebar }: AdminHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 md:px-8">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={openSidebar}
        >
          <Menu size={24} />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center flex-1 ml-6 md:ml-0">
          <div className="relative w-full max-w-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Right navigation */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>
            </button>

            {/* Notification dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Order #12345 was placed by John Doe
                    </p>
                    <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                  </div>
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Product "Wireless Headphones" is running low on stock
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50">
                    <p className="text-sm font-medium">
                      New customer registered
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Jane Smith created a new account
                    </p>
                    <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                  </div>
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-primary-600 hover:text-primary-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
