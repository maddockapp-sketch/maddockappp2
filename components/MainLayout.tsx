
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Home, Calendar, MessageCircle, Users, BarChart2, DollarSign, Settings } from 'lucide-react';

const clientLinks = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Agendar', href: '/book', icon: Calendar },
  { name: 'Pós-Cuidado', href: '/care-chat', icon: MessageCircle },
];

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Artistas', href: '/admin/artists', icon: Users },
  { name: 'Agenda', href: '/admin/schedule', icon: Calendar },
  { name: 'Financeiro', href: '/admin/accounting', icon: BarChart2 },
  { name: 'Configurações', href: '/admin/settings', icon: Settings },
];

const NavLinks = ({ links }: { links: typeof clientLinks }) => (
  <>
    {links.map((link) => (
      <NavLink
        key={link.name}
        to={link.href}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`
        }
      >
        <link.icon className="h-5 w-5" />
        <span className="font-medium">{link.name}</span>
      </NavLink>
    ))}
  </>
);

export default function MainLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = user?.role === 'admin' ? adminLinks : clientLinks;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-950 border-r border-gray-800 p-4">
        <h1 className="text-3xl font-bold font-display text-center text-white mb-8">MADDOCK</h1>
        <nav className="flex flex-col gap-2 flex-grow">
          <NavLinks links={links} />
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-3 p-2 mb-2">
            <img src={user?.avatarUrl} alt={user?.name} className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-red-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-gray-950 border-b border-gray-800">
         <h1 className="text-2xl font-bold font-display text-white">MADDOCK</h1>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
           {mobileMenuOpen ? <X/> : <Menu />}
         </button>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
          <div className="md:hidden bg-gray-950 p-4">
              <nav className="flex flex-col gap-2">
                 <NavLinks links={links} />
                 <hr className="my-4 border-gray-700"/>
                  <div className="flex items-center gap-3 p-2 mb-2">
                    <img src={user?.avatarUrl} alt={user?.name} className="h-10 w-10 rounded-full" />
                    <p className="font-semibold">{user?.name}</p>
                  </div>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-400 hover:bg-red-800 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
              </nav>
          </div>
      )}


      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
