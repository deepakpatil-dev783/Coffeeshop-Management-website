import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  Coffee,
  Calendar,
  User,
  ShieldAlert,
  BarChart3,
  Menu as MenuIcon,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservations" },
    { name: "About Us", path: "/home#about" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-coffee-950/90 text-coffee-50 border-b border-coffee-800/60 shadow-lg">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-coffee-700 via-coffee-600 to-coffee-400 p-0.5 shadow-coffee-glow group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-coffee-950 rounded-[14px] flex items-center justify-center">
              <Coffee className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight bg-gradient-to-r from-cream via-coffee-100 to-gold bg-clip-text text-transparent">
              Brew & Bean
            </span>
            <span className="block text-[10px] tracking-widest text-coffee-300 uppercase font-semibold">
              Artisan Coffee & Roastery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                location.pathname === link.path
                  ? "text-gold font-bold border-b-2 border-gold pb-1"
                  : "text-coffee-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === "staff" && (
            <Link
              to="/staff"
              className="flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/30"
            >
              <ShieldAlert className="w-4 h-4" />
              Staff Dashboard
            </Link>
          )}
          {user?.role === "owner" && (
            <Link
              to="/owner"
              className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30"
            >
              <BarChart3 className="w-4 h-4" />
              Owner Analytics
            </Link>
          )}
        </nav>

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl bg-coffee-900/80 hover:bg-coffee-800 text-coffee-100 border border-coffee-700/50 transition-all hover:scale-105 group"
            title="View Cart"
          >
            <ShoppingBag className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-coffee-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                {itemCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-coffee-900/90 border border-coffee-700 hover:border-gold/50 transition-all"
              >
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-gold/40"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-cream leading-tight truncate max-w-[120px]">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gold capitalize font-medium">
                    {user.role}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-coffee-300" />
              </button>

              {/* User Dropdown */}
              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-coffee-900 border border-coffee-700 rounded-2xl shadow-2xl p-2 z-50 text-coffee-100 backdrop-blur-xl animate-fade-in">
                  <div className="px-3 py-2 border-b border-coffee-800">
                    <p className="text-sm font-semibold text-cream">
                      {user.name}
                    </p>
                    <p className="text-xs text-coffee-300 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-coffee-800 text-coffee-200 hover:text-gold transition-colors"
                    >
                      <User className="w-4 h-4" /> My Profile & Orders
                    </Link>
                    <Link
                      to="/reservations"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-coffee-800 text-coffee-200 hover:text-gold transition-colors"
                    >
                      <Calendar className="w-4 h-4" /> My Reservations
                    </Link>
                    {(user.role === "staff" || user.role === "owner") && (
                      <Link
                        to="/staff"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-coffee-800 text-amber-300 font-medium transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" /> Staff
                        Dashboard
                      </Link>
                    )}
                    {user.role === "owner" && (
                      <Link
                        to="/owner"
                        onClick={() => setRoleDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-coffee-800 text-emerald-300 font-medium transition-colors"
                      >
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> Owner
                        Analytics
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-coffee-800 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-rose-950/50 text-rose-400 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-coffee-100 hover:text-gold transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-coffee-400 text-coffee-950 hover:brightness-110 transition-all shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-coffee-900 border border-coffee-700 text-coffee-200 hover:text-gold"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-coffee-950 border-b border-coffee-800 px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-coffee-200 hover:text-gold py-1"
            >
              {link.name}
            </Link>
          ))}
          {user?.role === "staff" && (
            <div className="pt-2 border-t border-coffee-800 flex flex-col gap-2">
              <Link
                to="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="text-amber-400 font-semibold flex items-center gap-2 text-sm"
              >
                <ShieldAlert className="w-4 h-4" /> Staff Dashboard
              </Link>
            </div>
          )}
          {user?.role === "owner" && (
            <div className="pt-2 border-t border-coffee-800 flex flex-col gap-2">
              <Link
                to="/owner"
                onClick={() => setMobileMenuOpen(false)}
                className="text-emerald-400 font-semibold flex items-center gap-2 text-sm"
              >
                <BarChart3 className="w-4 h-4" /> Owner Analytics
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
