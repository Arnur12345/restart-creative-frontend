import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png'
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <span className="font-bold text-2xl text-gray-800">Restart Creative</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/" className={`font-medium hover:text-primary-600 transition-colors ${location.pathname==='/'?'text-primary-600':'text-gray-700'}`}>Басты бет</Link>
          <Link to="/theme-weeks" className={`font-medium hover:text-primary-600 transition-colors ${location.pathname.startsWith('/theme-weeks')?'text-primary-600':'text-gray-700'}`}>Тақырыптық апталар</Link>
          <Link to="/admin" className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors">Админ</Link>
          <Link to="/register" className="text-primary-600 hover:underline font-medium">Тіркелу</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">{children || <Outlet />}</main>
    </div>
  );
};

export default Layout; 