import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/items', label: 'Items', icon: Package },
  ];

  return (
    <div className="min-h-screen flex" data-testid="admin-layout">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-background hidden md:block">
        <div className="p-6">
          <Link to="/" className="font-mono text-xl font-bold tracking-tighter uppercase block mb-8">
            AUTOPARTS
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-wider transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                  }`}
                  data-testid={`sidebar-${item.label.toLowerCase()}`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 font-mono text-xs uppercase tracking-wider hover:bg-secondary transition-colors w-full mt-4"
            data-testid="sidebar-logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;