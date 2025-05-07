import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, APP_CONFIG } from '../../config';
import axios from 'axios';
import UsersPage from './UsersPage';
import WeeksPage from './WeeksPage';
import MaterialsPage from './MaterialsPage';
import logo from '../../assets/logo.png';

const TABS = [
  { key: 'users', label: 'Пайдаланушылар' },
  { key: 'weeks', label: 'Тақырыптық апталар' },
  { key: 'materials', label: 'Материалдар' }
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const response = await axios.get(API_ENDPOINTS.AUTH.ME, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.is_admin) {
        navigate('/');
      }
      setUser(response.data);
    } catch (error) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-8 w-auto sm:h-10" />
              <span className="ml-3 text-lg font-bold text-gray-900 hidden sm:block">{APP_CONFIG.APP_NAME}</span>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <span className="text-gray-700">Сәлем, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Шығу
              </button>
            </div>
          </div>

          {/* Mobile menu panel */}
          <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden pb-3`}>
            <div className="pt-2 pb-3 space-y-1">
              <div className="px-3 py-2 text-gray-700">Сәлем, {user?.username}</div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
              >
                Шығу
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-2">
            {TABS.map(t => (
              <button
                key={t.key}
                className={`whitespace-nowrap py-3 px-3 sm:px-6 font-medium text-sm sm:text-base border-b-2 transition-colors ${
                  tab === t.key
                    ? 'border-primary-600 text-primary-700 bg-primary-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Tab content */}
        <div className="mt-6">
          {tab === 'users' && <UsersPage />}
          {tab === 'weeks' && <WeeksPage />}
          {tab === 'materials' && <MaterialsPage />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;