import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config';
import axios from 'axios';

const WeeksPage = () => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newWeek, setNewWeek] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    result_url: ''
  });
  const [editingWeek, setEditingWeek] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchWeeks();
  }, []);

  const fetchWeeks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.ADMIN.THEME_WEEKS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWeeks(response.data);
    } catch (error) {
      setError('Қате тақырыптық апталарды жүктегенде!');
      console.error('Error fetching weeks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeek = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.ADMIN.THEME_WEEKS,
        newWeek,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeeks([...weeks, response.data]);
      setNewWeek({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        result_url: ''
      });
      setShowAddForm(false);
    } catch (error) {
      setError('Қате тақырыптық аптаны қосқанда!');
      console.error('Error adding week:', error);
    }
  };

  const handleEditWeek = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_ENDPOINTS.ADMIN.THEME_WEEKS}/${editingWeek.id}`,
        editingWeek,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeeks(weeks.map(w => w.id === editingWeek.id ? response.data : w));
      setEditingWeek(null);
    } catch (error) {
      setError('Қате тақырыптық аптаны өзгерткенде!');
      console.error('Error editing week:', error);
    }
  };

  const handleDeleteWeek = async (weekId) => {
    if (!window.confirm('Шынымен жойғыңыз келе ме?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_ENDPOINTS.ADMIN.THEME_WEEKS}/${weekId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeeks(weeks.filter(w => w.id !== weekId));
    } catch (error) {
      setError('Қате тақырыптық аптаны жойғанда!');
      console.error('Error deleting week:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Тақырыптық апталар</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showAddForm ? 'Жабу' : 'Жаңа тақырыптық апта қосу'}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showAddForm && (
        <form onSubmit={handleAddWeek} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тақырып</label>
              <input
                type="text"
                value={newWeek.title}
                onChange={(e) => setNewWeek({...newWeek, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Нәтиже URL</label>
              <input
                type="url"
                value={newWeek.result_url}
                onChange={(e) => setNewWeek({...newWeek, result_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Басталу күні</label>
              <input
                type="date"
                value={newWeek.start_date}
                onChange={(e) => setNewWeek({...newWeek, start_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Аяқталу күні</label>
              <input
                type="date"
                value={newWeek.end_date}
                onChange={(e) => setNewWeek({...newWeek, end_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
              <textarea
                value={newWeek.description}
                onChange={(e) => setNewWeek({...newWeek, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Қосу
            </button>
          </div>
        </form>
      )}

      {editingWeek && (
        <form onSubmit={handleEditWeek} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тақырып</label>
              <input
                type="text"
                value={editingWeek.title}
                onChange={(e) => setEditingWeek({...editingWeek, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Нәтиже URL</label>
              <input
                type="url"
                value={editingWeek.result_url}
                onChange={(e) => setEditingWeek({...editingWeek, result_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Басталу күні</label>
              <input
                type="date"
                value={editingWeek.start_date}
                onChange={(e) => setEditingWeek({...editingWeek, start_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Аяқталу күні</label>
              <input
                type="date"
                value={editingWeek.end_date}
                onChange={(e) => setEditingWeek({...editingWeek, end_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
              <textarea
                value={editingWeek.description}
                onChange={(e) => setEditingWeek({...editingWeek, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setEditingWeek(null)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Болдырмау
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Сақтау
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 font-semibold text-gray-700">Тақырып</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Сипаттама</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Басталуы</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Аяқталуы</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Нәтиже</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map(w => (
                <tr key={w.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{w.title}</td>
                  <td className="py-3 px-4">{w.description}</td>
                  <td className="py-3 px-4">{new Date(w.start_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{new Date(w.end_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <a
                      href={w.result_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      Нәтижені көру
                    </a>
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => setEditingWeek(w)}
                      className="px-3 py-1 rounded-lg text-sm bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      Өзгерту
                    </button>
                    <button
                      onClick={() => handleDeleteWeek(w.id)}
                      className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      Жою
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WeeksPage;