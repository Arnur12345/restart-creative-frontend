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

  // Statistics
  const totalWeeks = weeks.length;
  const totalVideos = weeks.reduce((acc, w) => acc + (w.videos_count || 0), 0);
  const lastWeek = weeks[weeks.length - 1];

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 p-6 flex items-center">
            <div className="mr-6">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M12 3v18m9-9H3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Барлық апта</div>
              <div className="text-2xl font-medium text-black">{totalWeeks}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 flex items-center">
            <div className="mr-6">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Барлық видео</div>
              <div className="text-2xl font-medium text-black">{totalVideos}</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 flex items-center">
            <div className="mr-6">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="1.5"/>
                <path d="M12 8v4l3 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Соңғы апта</div>
              <div className="text-lg font-medium text-black truncate max-w-xs">{lastWeek ? lastWeek.title : '-'}</div>
            </div>
          </div>
        </div>

        {/* Theme Weeks Grid */}
        <h1 className="text-3xl font-bold mb-10 text-black">Тақырыптық апталар</h1>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weeks.map(week => (
              <div
                key={week.id}
                className="bg-gray-50 p-6 cursor-pointer transition-all duration-200 hover:bg-gray-100"
                onClick={() => navigate(`/theme-weeks/${week.id}`)}
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center mb-4 gap-3">
                      <span className="inline-block bg-white text-black text-xs px-3 py-1">
                        {week.videos_count} видео
                      </span>
                      <span className="text-gray-500 text-xs">
                        {new Date(week.start_date).toLocaleDateString()} - {new Date(week.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-medium mb-3 text-black">{week.title}</h2>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">{week.description}</p>
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-black">Толығырақ</span>
                    <svg 
                      className="ml-2 w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {weeks.length === 0 && !loading && (
          <div className="text-center py-16 bg-gray-50">
            <p className="text-gray-500">Апталар әлі жоқ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeWeeks;