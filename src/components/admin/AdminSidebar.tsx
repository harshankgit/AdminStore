import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PackagePlus,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  X,
  Tag,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface AdminSidebarProps {
  mobile?: boolean;
  closeSidebar?: () => void;
}

const AdminSidebar = ({ mobile = false, closeSidebar }: AdminSidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      exact: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <Package size={20} />,
    },
    {
      name: "Add Product",
      path: "/admin/add-product",
      icon: <PackagePlus size={20} />,
    },
    {
      name: "Categories",
      path: "/admin/create-category",
      icon: <Tag size={20} />,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <Users size={20} />,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-primary-800 text-white">
      {/* Mobile header with close button */}
      {mobile && (
        <div className="flex items-center justify-between px-4 h-16 bg-primary-900">
          <Link to="/admin" className="flex items-center text-xl font-semibold">
            Admin Panel
          </Link>
          <button
            className="text-white p-1 rounded-md hover:bg-primary-700"
            onClick={closeSidebar}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Logo */}
      {!mobile && (
        <div className="flex items-center h-16 px-6 bg-primary-900">
          <Link to="/admin" className="flex items-center text-xl font-semibold">
            Admin Panel
          </Link>
        </div>
      )}

      {/* Admin info */}
      <div className="px-6 py-4 border-b border-primary-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-lg font-semibold">
            {user?.name?.charAt(0) || "A"}
          </div>
          <div className="ml-3">
            <p className="font-medium">{user?.name || "Admin User"}</p>
            <p className="text-xs text-primary-300">
              {user?.email || "admin@example.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-2 py-2 rounded-md transition-colors ${
              isActive(item.path) &&
              (item.exact ? location.pathname === item.path : true)
                ? "bg-primary-700 text-white"
                : "text-primary-200 hover:bg-primary-700 hover:text-white"
            }`}
            onClick={mobile ? closeSidebar : undefined}
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}

        <hr className="my-4 border-primary-700" />

        <Link
          to="/"
          className="flex items-center px-2 py-2 text-primary-200 rounded-md hover:bg-primary-700 hover:text-white"
          onClick={mobile ? closeSidebar : undefined}
        >
          <span className="mr-3">
            <ShoppingBag size={20} />
          </span>
          <span>View Store</span>
        </Link>

        <button
          className="flex items-center w-full px-2 py-2 text-primary-200 rounded-md hover:bg-primary-700 hover:text-white"
          onClick={() => {
            logout();
            if (mobile && closeSidebar) closeSidebar();
          }}
        >
          <span className="mr-3">
            <LogOut size={20} />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminSidebar;
