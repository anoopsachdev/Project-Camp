import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Folder, LogOut, User, Settings } from "lucide-react";
import { cn } from "./ui/Button";
import Avatar from "react-avatar";

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Folder className="h-6 w-6" />
            Project Camp
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100",
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar
              name={user?.fullName || user?.username || "User"}
              size="32"
              round={true}
              textSizeRatio={1.75}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
            data-testid="logout-btn"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-600">Project Camp</h1>
          {/* Mobile menu trigger would go here */}
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
