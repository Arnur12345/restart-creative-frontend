import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, APP_CONFIG } from '../config';
import axios from 'axios';
import logo from '../assets/logo.png';

const TABS = [
  { key: 'users', label: 'Пайдаланушылар' },
  { key: 'weeks', label: 'Тақырыптық апталар' },
  { key: 'videos', label: 'Видеолар' },
  { key: 'materials', label: 'Материалдар' }
];

const MATERIAL_TYPES = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'image', label: 'Сурет' },
  { value: 'pdf', label: 'PDF' },
  { value: 'video', label: 'Видео' }
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [themeWeeks, setThemeWeeks] = useState([]);
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [error, setError] = useState('');
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    student_name: '',
    material_type: 'youtube',
    url: '',
    theme_week_id: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchData();
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
    }
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, themeWeeksRes, videosRes, materialsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN.USERS, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(API_ENDPOINTS.THEME_WEEKS.LIST),
        axios.get(API_ENDPOINTS.VIDEOS.LIST),
        axios.get(API_ENDPOINTS.ADMIN.MATERIALS, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersRes.data);
      setThemeWeeks(themeWeeksRes.data);
      setVideos(videosRes.data);
      setMaterials(materialsRes.data);
    } catch (error) {
      setError('Қате деректерді жүктегенде!');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleWinner = async (materialId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        API_ENDPOINTS.ADMIN.UPDATE_MATERIAL(materialId),
        { is_winner: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials(materials.map(m => 
        m.id === materialId ? { ...m, is_winner: !currentStatus } : m
      ));
    } catch (error) {
      setError('Қате материалды жаңартқанда!');
      console.error('Error updating material:', error);
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.ADMIN.MATERIALS,
        newMaterial,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials([...materials, response.data]);
      setNewMaterial({
        title: '',
        description: '',
        student_name: '',
        material_type: 'youtube',
        url: '',
        theme_week_id: ''
      });
      setShowAddForm(false);
    } catch (error) {
      setError('Қате материалды қосқанда!');
      console.error('Error adding material:', error);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Шынымен жойғыңыз келе ме?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        API_ENDPOINTS.ADMIN.UPDATE_MATERIAL(materialId),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials(materials.filter(m => m.id !== materialId));
    } catch (error) {
      setError('Қате материалды жойғанда!');
      console.error('Error deleting material:', error);
    }
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
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Lofgo" className="h-10 w-auto" />
            <span className="ml-3 text-xl font-bold">{APP_CONFIG.APP_NAME}</span>
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

      <div className="container mx-auto px-6 mt-8">
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
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Пайдаланушылар</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">Логин</th>
                    <th className="py-2 px-4">Админ бе?</th>
                    <th className="py-2 px-4">Тіркелген күні</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{u.username}</td>
                      <td className="py-2 px-4">{u.is_admin ? 'Иә' : 'Жоқ'}</td>
                      <td className="py-2 px-4">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Theme Weeks Tab */}
        {tab === 'weeks' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Тақырыптық апталар</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">Тақырып</th>
                    <th className="py-2 px-4">Сипаттама</th>
                    <th className="py-2 px-4">Басталуы</th>
                    <th className="py-2 px-4">Аяқталуы</th>
                  </tr>
                </thead>
                <tbody>
                  {themeWeeks.map(w => (
                    <tr key={w.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{w.title}</td>
                      <td className="py-2 px-4">{w.description}</td>
                      <td className="py-2 px-4">{new Date(w.start_date).toLocaleDateString()}</td>
                      <td className="py-2 px-4">{new Date(w.end_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {tab === 'videos' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Видеолар</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">Атауы</th>
                    <th className="py-2 px-4">Сипаттама</th>
                    <th className="py-2 px-4">Автор</th>
                    <th className="py-2 px-4">Тақырыптық апта</th>
                    <th className="py-2 px-4">YouTube</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(v => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{v.title}</td>
                      <td className="py-2 px-4">{v.description}</td>
                      <td className="py-2 px-4">{v.author}</td>
                      <td className="py-2 px-4">{themeWeeks.find(w=>w.id===v.theme_week_id)?.title || '-'}</td>
                      <td className="py-2 px-4">
                        <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">YouTube</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {tab === 'materials' && (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Материалдар</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {showAddForm ? 'Жабу' : 'Жаңа материал қосу'}
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddMaterial} className="mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Атауы</label>
                    <input
                      type="text"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
                    <input
                      type="text"
                      value={newMaterial.student_name}
                      onChange={(e) => setNewMaterial({...newMaterial, student_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Түрі</label>
                    <select
                      value={newMaterial.material_type}
                      onChange={(e) => setNewMaterial({...newMaterial, material_type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      {MATERIAL_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Тақырыптық апта</label>
                    <select
                      value={newMaterial.theme_week_id}
                      onChange={(e) => setNewMaterial({...newMaterial, theme_week_id: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="">Таңдаңыз</option>
                      {themeWeeks.map(week => (
                        <option key={week.id} value={week.id}>{week.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Сипаттама</label>
                    <textarea
                      value={newMaterial.description}
                      onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows="3"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <input
                      type="url"
                      value={newMaterial.url}
                      onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
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

            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4">Атауы</th>
                    <th className="py-2 px-4">Сипаттама</th>
                    <th className="py-2 px-4">Автор</th>
                    <th className="py-2 px-4">Түрі</th>
                    <th className="py-2 px-4">Тақырыптық апта</th>
                    <th className="py-2 px-4">Жеңімпаз</th>
                    <th className="py-2 px-4">Әрекеттер</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map(m => (
                    <tr key={m.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{m.title}</td>
                      <td className="py-2 px-4">{m.description}</td>
                      <td className="py-2 px-4">{m.student_name}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                          {MATERIAL_TYPES.find(t => t.value === m.material_type)?.label || m.material_type}
                        </span>
                      </td>
                      <td className="py-2 px-4">{themeWeeks.find(w=>w.id===m.theme_week_id)?.title || '-'}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${m.is_winner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {m.is_winner ? 'Иә' : 'Жоқ'}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleWinner(m.id, m.is_winner)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              m.is_winner 
                                ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {m.is_winner ? 'Жеңімпазды алып тастау' : 'Жеңімпаз етіп белгілеу'}
                          </button>
                          <button
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="px-3 py-1 rounded-lg text-sm bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Жою
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
