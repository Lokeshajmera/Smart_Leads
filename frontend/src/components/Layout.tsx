import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, LogOut, LayoutDashboard, Users, Menu, X } from 'lucide-react';
import clsx from 'clsx';

const Layout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    ...(user?.role === 'admin'
      ? [{ to: '/users', label: 'Manage Users', icon: <Users size={20} /> }]
      : []),
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8 px-1">
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
          SL
        </div>
        <span className="text-xl font-bold text-foreground">Smart Leads</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={clsx(
              'flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium',
              location.pathname === link.to
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-muted pt-4 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-muted-foreground truncate max-w-[120px]">
            {user?.name}
          </span>
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full uppercase">
            {user?.role}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted rounded-md transition-colors"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  const pageTitle =
    location.pathname === '/' ? 'Leads Dashboard' : 'User Management';

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-background border-r border-muted px-4 py-6">
        <SidebarContent />
      </aside>

      {/* ── Mobile Sidebar Backdrop ───────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Drawer ─────────────────────────── */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-background border-r border-muted px-4 py-6 transition-transform duration-300 md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button inside drawer */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Header */}
        <header className="h-14 md:h-16 bg-background border-b border-muted flex items-center px-4 md:px-8 shadow-sm gap-3 shrink-0">
          {/* Hamburger – mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-base md:text-xl font-semibold text-foreground truncate">
            {pageTitle}
          </h1>

          {/* Mobile theme toggle in header */}
          <button
            onClick={toggleTheme}
            className="md:hidden ml-auto p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
