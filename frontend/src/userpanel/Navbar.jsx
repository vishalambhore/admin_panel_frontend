// components/layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaRobot, FaBars, FaTimes, FaUserCog } from 'react-icons/fa';
import { useUser } from '../contexts/UserContext';
import AuthModal from '../components/AuthModal';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-gray-200 via-purple-200 to-indigo-200 shadow-xl">
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 rounded-lg blur opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <FaRobot className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    AI Project
                  </h1>
                  <p className="text-[10px] text-gray-400 -mt-1">Creative Studio</p>
                </div>
              </div>
            </div>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              <Link to="/" className="relative group px-4 py-2 rounded-lg text-gray-800 hover:text-blue-500 transition">
                <span className="relative z-10">Home</span>
              </Link>
              <Link to="/packages" className="relative group px-4 py-2 rounded-lg text-gray-800 hover:text-blue-500 transition">
                <span className="relative z-10">Packages</span>
              </Link>
              <Link to="/contact" className="relative group px-4 py-2 rounded-lg text-gray-800 hover:text-blue-500 transition">
                <span className="relative z-10">Contact</span>
              </Link>
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden md:block">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/user-dashboard" className="text-sm text-gray-700 hover:text-blue-600">
                    Welcome, {user.name.split(' ')[0]}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-700 rounded-lg transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border rounded-lg text-gray-800 hover:text-blue-500 hover:bg-white/20 transition"
                >
                  <FaUserCog className="w-4 h-4" />
                  <span className="text-sm">Login / Register</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-gray-800"
              >
                {!isMobileMenuOpen ? <FaBars className="h-5 w-5" /> : <FaTimes className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="bg-gradient-to-b from-gray-400 to-purple-400 border-t border-white/10 px-4 pt-2 pb-4 space-y-2">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg">
              <span className="text-lg">🏠</span>
              <span className="font-medium">Home</span>
            </Link>
            <Link to="/packages" onClick={closeMobileMenu} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg">
              <span className="text-lg">📦</span>
              <span className="font-medium">Packages</span>
            </Link>
            <Link to="/contact" onClick={closeMobileMenu} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg">
              <span className="text-lg">📞</span>
              <span className="font-medium">Contact</span>
            </Link>
            <div className="pt-3 mt-2 border-t border-white/10">
              {user ? (
                <>
                  <Link to="/user-dashboard" onClick={closeMobileMenu} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg">
                    <FaUserCog className="w-4 h-4" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <button onClick={() => { closeMobileMenu(); handleLogout(); }} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left">
                    <span className="text-lg">🚪</span>
                    <span className="font-medium">Logout</span>
                  </button>
                </>
              ) : (
                <button onClick={() => { closeMobileMenu(); setIsAuthModalOpen(true); }} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left">
                  <FaUserCog className="w-4 h-4" />
                  <span className="font-medium">Login / Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;