import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config';
import axios from 'axios';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [themeWeeks, setThemeWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    student_name: '',
    youtube_url: '',
    theme_week_id: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [videosRes, themeWeeksRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN.VIDEOS, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(API_ENDPOINTS.THEME_WEEKS.LIST)
      ]);
      setVideos(videosRes.data);
      setThemeWeeks(themeWeeksRes.data);
    } catch (error) {
      setError('Қате деректерді жүктегенде!');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.ADMIN.VIDEOS,
        newVideo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos([...videos, response.data]);
      setNewVideo({
        title: '',
        description: '',
        student_name: '',
        youtube_url: '',
        theme_week_id: ''
      });
      setShowAddForm(false);
    } catch (error) {
      setError('Қате видеоны қосқанда!');
      console.error('Error adding video:', error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Шынымен жойғыңыз келе ме?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${API_ENDPOINTS.ADMIN.VIDEOS}/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setVideos(videos.filter(v => v.id !== videoId));
    } catch (error) {
      setError('Қате видеоны жойғанда!');
      console.error('Error deleting video:', error);
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
        <h2 className="text-2xl font-bold">Видеолар</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showAddForm ? 'Жабу' : 'Жаңа видео қосу'}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showAddForm && (
        <form onSubmit={handleAddVideo} className="mb-8 p-6 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Атауы</label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Автор</label>
              <input
                type="text"
                value={newVideo.student_name}
                onChange={(e) => setNewVideo({...newVideo, student_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
              <input
                type="url"
                value={newVideo.youtube_url}
                onChange={(e) => setNewVideo({...newVideo, youtube_url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тақырыптық апта</label>
              <select
                value={newVideo.theme_week_id}
                onChange={(e) => setNewVideo({...newVideo, theme_week_id: e.target.value})}
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
                value={newVideo.description}
                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
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

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-3 px-4 font-semibold text-gray-700">Атауы</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Сипаттама</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Автор</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Тақырыптық апта</th>
                <th className="py-3 px-4 font-semibold text-gray-700">YouTube</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(v => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{v.title}</td>
                  <td className="py-3 px-4">{v.description}</td>
                  <td className="py-3 px-4">{v.student_name}</td>
                  <td className="py-3 px-4">{themeWeeks.find(w=>w.id===v.theme_week_id)?.title || '-'}</td>
                  <td className="py-3 px-4">
                    <a
                      href={v.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      YouTube
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDeleteVideo(v.id)}
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

export default VideosPage; 