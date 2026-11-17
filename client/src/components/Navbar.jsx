import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Menu,
  X,
  Stethoscope,
  History,
  BookOpen,
  Home,
} from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/check', label: 'Symptom Checker', icon: Stethoscope },
  { to: '/history', label: 'History', icon: History },
  { to: '/health-tips', label: 'Health Tips', icon: BookOpen },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-navy-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-navy-800 to-teal-700 bg-clip-text text-transparent">
              HealthAI
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-teal-50 text-teal-700 shadow-sm'
                      : 'text-navy-600 hover:bg-navy-50 hover:text-navy-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-navy-600 hover:bg-navy-50 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-navy-100 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-navy-600 hover:bg-navy-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
