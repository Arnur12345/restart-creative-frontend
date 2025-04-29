import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';

// Функция для извлечения id видео из ссылки YouTube
function extractYoutubeId(url) {
  if (!url) return '';
  // Поддержка форматов: https://www.youtube.com/watch?v=xxxx, https://youtu.be/xxxx, https://www.youtube.com/embed/xxxx
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  // Если формат v=xxxx
  if (url.includes('v=')) return url.split('v=')[1].substring(0, 11);
  return '';
}

// Функция для рендеринга материала в зависимости от типа
const renderMaterial = (material) => {
  switch (material.material_type) {
    case 'youtube':
      return (
        <div className="aspect-video rounded-t-xl overflow-hidden">
          <iframe
            width="100%"
            height="220"
            src={`https://www.youtube.com/embed/${extractYoutubeId(material.url)}`}
            title={material.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    case 'image':
      return (
        <div className="aspect-video rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <img src={material.url} alt={material.title} className="max-h-full max-w-full object-contain" />
        </div>
      );
    case 'pdf':
      return (
        <div className="aspect-video rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <a 
            href={material.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center justify-center p-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-600 font-medium">PDF файлды ашу</span>
          </a>
        </div>
      );
    case 'video':
      return (
        <div className="aspect-video rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <video 
            controls 
            className="max-h-full max-w-full" 
            src={material.url}
          >
            Ваш браузер не поддерживает видео тег.
          </video>
        </div>
      );
    default:
      return (
        <div className="aspect-video rounded-t-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          <a 
            href={material.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center justify-center p-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
            <span className="text-blue-600 font-medium">Материалды ашу</span>
          </a>
        </div>
      );
  }
};

const WeekLandingPage = () => {
  const { id } = useParams();
  const [week, setWeek] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    
    const fetchData = async () => {
      try {
        const [weekRes, materialsRes] = await Promise.all([
          axios.get(API_ENDPOINTS.THEME_WEEKS.DETAIL(id)),
          axios.get(API_ENDPOINTS.MATERIALS.LIST)
        ]);
        
        setWeek(weekRes.data);
        // Фильтруем материалы для текущей недели
        const weekMaterials = materialsRes.data.filter(
          material => material.theme_week_id === id
        );
        setMaterials(weekMaterials);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Ошибка при загрузке данных недели!');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary-700 font-medium">Загрузка...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Ошибка!</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );

  if (!week) return null;

  // Победители и остальные материалы
  const winners = materials.filter(m => m.is_winner);
  const others = materials.filter(m => !m.is_winner);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Информация о неделе */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center">
            <div className="bg-indigo-100 rounded-full p-4 mr-5">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M12 3v18m9-9H3" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Апта</div>
              <div className="text-2xl font-bold text-gray-900">{week.title}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center">
            <div className="bg-green-100 rounded-full p-4 mr-5">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Даталар</div>
              <div className="text-lg font-semibold text-gray-900">{new Date(week.start_date).toLocaleDateString()} - {new Date(week.end_date).toLocaleDateString()}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center">
            <div className="bg-blue-100 rounded-full p-4 mr-5">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Сипаттама</div>
              <div className="text-gray-700 text-base">{week.description}</div>
            </div>
          </div>
        </div>

        {/* Победители */}
        {winners.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.75L18.2 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              Жеңімпаз оқушылар
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left bg-white rounded-xl shadow">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 font-semibold text-gray-700">Атауы</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Автор</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Түрі</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Сипаттама</th>
                    <th className="py-3 px-4 font-semibold text-gray-700">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {winners.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-green-50">
                      <td className="py-3 px-4 font-bold text-gray-900">{m.title}</td>
                      <td className="py-3 px-4">{m.student_name}</td>
                      <td className="py-3 px-4 capitalize">{m.material_type}</td>
                      <td className="py-3 px-4 text-gray-600">{m.description}</td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow">ЖЕҢІМПАЗ</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Остальные материалы */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Барлық материалдар
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {others.length > 0 ? others.map((material) => (
              <div key={material.id} className="bg-white rounded-xl shadow p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
                <div className="mb-3">
                  <div className="flex items-center mb-2">
                    <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold mr-2 capitalize">{material.material_type}</span>
                    <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-semibold">{new Date(material.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{material.title}</h4>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{material.description}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                      {(material.student_name || '').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{material.student_name}</span>
                  </div>
                  <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs font-semibold">Ашу</a>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center text-gray-400 py-10">Материалдар жоқ</div>
            )}
          </div>
        </div>

        {/* Видео секция */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Видеолар
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {week.videos && week.videos.length > 0 ? week.videos.map((video) => (
              <div key={video.id} className="bg-white rounded-xl shadow p-6 flex flex-col hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-video rounded-xl overflow-hidden mb-3">
                  <iframe
                    width="100%"
                    height="220"
                    src={`https://www.youtube.com/embed/${extractYoutubeId(video.youtube_url)}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{video.title}</h4>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
                <div className="flex items-center mt-auto">
                  <div className="bg-primary-100 text-primary-700 rounded-full w-8 h-8 flex items-center justify-center mr-2">
                    {(video.student_name || '').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{video.student_name}</span>
                  <span className="ml-auto text-xs text-gray-400">{new Date(video.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )) : (
              <div className="col-span-2 text-center text-gray-400 py-10">Видео жоқ</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekLandingPage;