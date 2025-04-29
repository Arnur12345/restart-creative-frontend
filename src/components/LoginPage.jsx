import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, APP_CONFIG } from '../config';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(API_ENDPOINTS.AUTH.LOGIN, { username, password });
      if (res.data.is_admin) {
        localStorage.setItem('token', res.data.token);
        window.location = '/admin';
      } else {
        setError('Тек қана админдерге рұқсат!');
      }
    } catch (err) {
      setError('Қате логин немесе құпия сөз!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={APP_CONFIG.LOGO_PATH} alt="Logo" className="h-14 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Админге кіру</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-1">Логин</label>
            <input type="text" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Құпия сөз</label>
            <input type="password" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center" disabled={loading}>
            {loading ? <span className="loader mr-2"></span> : null}
            Кіру
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 