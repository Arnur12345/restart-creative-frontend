import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ThemeWeeks = () => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(API_ENDPOINTS.THEME_WEEKS.LIST)
      .then(res => setWeeks(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Статистика
  const totalWeeks = weeks.length;
  const totalVideos = weeks.reduce((acc, w) => acc + (w.videos_count || 0), 0);
  const lastWeek = weeks[weeks.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-2 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Блок статистики */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-4 md:p-8 flex items-center">
            <div className="bg-indigo-100 rounded-full p-3 md:p-4 mr-4 md:mr-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 3v18m9-9H3" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-gray-500 text-xs md:text-sm mb-1">Барлық апта</div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">{totalWeeks}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-4 md:p-8 flex items-center">
            <div className="bg-green-100 rounded-full p-3 md:p-4 mr-4 md:mr-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-gray-500 text-xs md:text-sm mb-1">Барлық видео</div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">{totalVideos}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-4 md:p-8 flex items-center">
            <div className="bg-blue-100 rounded-full p-3 md:p-4 mr-4 md:mr-5">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3b82f6" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-gray-500 text-xs md:text-sm mb-1">Соңғы апта</div>
              <div className="text-base md:text-lg font-semibold text-gray-900">{lastWeek ? lastWeek.title : '-'}</div>
            </div>
          </div>
        </div>

        {/* Сетка карточек недель */}
        <h1 className="text-2xl md:text-4xl font-extrabold mb-6 md:mb-8 text-gray-900 text-center md:text-left">Тақырыптық апталар</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {weeks.map(week => (
            <div
              key={week.id}
              className="rounded-xl md:rounded-2xl shadow-md md:shadow-xl bg-white p-4 md:p-8 cursor-pointer border-2 border-transparent hover:border-indigo-400 transition-all duration-200 hover:scale-[1.03] flex flex-col justify-between min-h-[180px] md:min-h-[220px]"
              onClick={() => navigate(`/theme-weeks/${week.id}`)}
            >
              <div>
                <div className="flex flex-wrap items-center mb-2 gap-2">
                  <span className="inline-block bg-indigo-100 text-indigo-600 rounded-full px-2 md:px-3 py-1 text-xs font-semibold mr-1">{week.videos_count} видео</span>
                  <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-2 md:px-3 py-1 text-xs font-semibold">{new Date(week.start_date).toLocaleDateString()} - {new Date(week.end_date).toLocaleDateString()}</span>
                </div>
                <h2 className="text-base md:text-xl font-bold mb-2 text-gray-900 truncate">{week.title}</h2>
                <p className="text-gray-600 text-xs md:text-sm line-clamp-3 mb-4">{week.description}</p>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-xs text-gray-400">Толығырақ</span>
                <svg className="ml-1 w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))}
        </div>
        {loading && <div className="text-center py-12 text-lg text-gray-600">Загрузка...</div>}
      </div>
    </div>
  );
};

export default ThemeWeeks; 