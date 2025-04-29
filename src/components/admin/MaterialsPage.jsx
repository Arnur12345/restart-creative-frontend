import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../config';
import axios from 'axios';

const MATERIAL_TYPES = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'image', label: 'Сурет' },
  { value: 'pdf', label: 'PDF' },
  { value: 'video', label: 'Видео' }
];

const CLOUDINARY_CONFIG = {
  cloudinaryUrl: 'https://api.cloudinary.com/v1_1/dq2pbzrtu/image/upload',
  cloudinaryPreset: 'adilgazy',
  cloudinaryCloudName: 'dq2pbzrtu'
};

const MaterialsPage = () => {
  const [materials, setMaterials] = useState([]);
  const [themeWeeks, setThemeWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    student_name: '',
    material_type: 'youtube',
    url: '',
    theme_week_id: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [materialsRes, themeWeeksRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN.MATERIALS, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(API_ENDPOINTS.THEME_WEEKS.LIST)
      ]);
      setMaterials(materialsRes.data);
      setThemeWeeks(themeWeeksRes.data);
    } catch (error) {
      setError('Қате деректерді жүктегенде!');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.cloudinaryPreset);

    try {
      const response = await axios.post(CLOUDINARY_CONFIG.cloudinaryUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Файлды жүктеу кезінде қате пайда болды');
    }
  };

  const handleAddMaterial = async (e) => {
    e.preventDefault();
    try {
      let uploadedUrl = newMaterial.url;
      
      if (newMaterial.material_type !== 'youtube') {
        if (!selectedFile) {
          setError('Файлды таңдаңыз');
          return;
        }
        setLoading(true);
        uploadedUrl = await uploadToCloudinary(selectedFile);
      } else {
        if (!newMaterial.url) {
          setError('YouTube URL енгізіңіз');
          return;
        }
      }
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        API_ENDPOINTS.ADMIN.MATERIALS,
        { ...newMaterial, url: uploadedUrl },
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
      setSelectedFile(null);
      setUploadProgress(0);
      setShowAddForm(false);
    } catch (error) {
      setError('Қате материалды қосқанда!');
      console.error('Error adding material:', error);
    } finally {
      setLoading(false);
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
        <h2 className="text-2xl font-bold">Материалдар</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {showAddForm ? 'Жабу' : 'Жаңа материал қосу'}
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

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
              {newMaterial.material_type === 'youtube' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                  <input
                    type="text"
                    value={newMaterial.url}
                    onChange={(e) => setNewMaterial({...newMaterial, url: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Файл</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                  {uploadProgress > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-primary-600 h-2.5 rounded-full"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{uploadProgress}% жүктелді</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Жүктелуде...' : 'Қосу'}
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
                <th className="py-3 px-4 font-semibold text-gray-700">Түрі</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Тақырыптық апта</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Жеңімпаз</th>
                <th className="py-3 px-4 font-semibold text-gray-700">Әрекеттер</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{m.title}</td>
                  <td className="py-3 px-4">{m.description}</td>
                  <td className="py-3 px-4">{m.student_name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {MATERIAL_TYPES.find(t => t.value === m.material_type)?.label || m.material_type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{themeWeeks.find(w=>w.id===m.theme_week_id)?.title || '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${m.is_winner ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {m.is_winner ? 'Иә' : 'Жоқ'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
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
    </div>
  );
};

export default MaterialsPage; 