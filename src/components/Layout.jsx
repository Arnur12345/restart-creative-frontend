import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      <nav className="bg-white shadow-md py-4 px-4 md:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-4">
            <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto" />
            <span className="font-bold text-lg md:text-2xl text-gray-800">Restart Creative</span>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`font-medium hover:text-primary-600 transition-colors ${location.pathname==='/'?'text-primary-600':'text-gray-700'}`}>Басты бет</Link>
            <Link to="/theme-weeks" className={`font-medium hover:text-primary-600 transition-colors ${location.pathname.startsWith('/theme-weeks')?'text-primary-600':'text-gray-700'}`}>Тақырыптық апталар</Link>
            <Link to="/admin" className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">Админ</Link>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4 space-y-4`}>
          <Link 
            to="/" 
            className={`block font-medium hover:text-primary-600 transition-colors ${location.pathname==='/'?'text-primary-600':'text-gray-700'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Басты бет
          </Link>
          <Link 
            to="/theme-weeks" 
            className={`block font-medium hover:text-primary-600 transition-colors ${location.pathname.startsWith('/theme-weeks')?'text-primary-600':'text-gray-700'}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Тақырыптық апталар
          </Link>
          <Link 
            to="/admin" 
            className="block bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors w-full text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Админ
          </Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">{children || <Outlet />}</main>
    </div>
  );
};

export default Layout;