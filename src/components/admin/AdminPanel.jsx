import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, APP_CONFIG } from '../../config';
import axios from 'axios';
import UsersPage from './UsersPage';
import WeeksPage from './WeeksPage';
import VideosPage from './VideosPage';
import MaterialsPage from './MaterialsPage';

const TABS = [
  { key: 'users', label: 'Пайдаланушылар' },
  { key: 'weeks', label: 'Тақырыптық апталар' },
  { key: 'videos', label: 'Видеолар' },
  { key: 'materials', label: 'Материалдар' }
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');

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
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={APP_CONFIG.LOGO_PATH} alt="Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl font-bold">{APP_CONFIG.APP_NAME} — Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Сәлем, {user?.username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Шығу
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        <div className="flex space-x-4 border-b mb-8">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`px-6 py-2 font-semibold border-b-2 transition-colors ${tab===t.key ? 'border-primary-600 text-primary-700 bg-primary-50' : 'border-transparent text-gray-600 hover:text-primary-600'}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'users' && <UsersPage />}
        {tab === 'weeks' && <WeeksPage />}
        {tab === 'videos' && <VideosPage />}
        {tab === 'materials' && <MaterialsPage />}
      </main>
    </div>
  );
};

export default AdminPanel;