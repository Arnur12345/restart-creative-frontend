import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';
import axios from 'axios';

// Function to extract YouTube video ID from URL
function extractYoutubeId(url) {
  if (!url) return '';
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regExp);
  if (match && match[1]) return match[1];
  if (url.includes('v=')) return url.split('v=')[1].substring(0, 11);
  return '';
}

const materialTypeMap = {
  'youtube': 'YouTube видео',
  'image': 'Сурет',
  'pdf': 'PDF',
  'video': 'Видео',
  'link': 'Сілтеме'
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
        // Winners first
        const weekMaterials = materialsRes.data
          .filter(m => m.theme_week_id === id)
          .sort((a, b) => (b.is_winner ? 1 : 0) - (a.is_winner ? 1 : 0));
        setMaterials(weekMaterials);
      } catch (err) {
        setError('Деректерді жүктеу қатесі!');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="p-8 text-center max-w-md">
          <h2 className="text-xl font-medium text-red-600 mb-2">Қате!</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );

  if (!week) return null;

  const winners = materials.filter(m => m.is_winner);
  const others = materials.filter(m => !m.is_winner);

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Weekly Goal Section */}
        <div className="mb-16 flex flex-col md:flex-row items-start gap-12">
          <div className="flex-shrink-0 w-full md:w-1/3">
            <img 
              src={week.image_url} 
              alt="Week illustration" 
              className="w-full rounded-lg object-cover" 
            />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black mb-6">Апталық мақсаты</h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {week.description}
            </p>
          </div>
        </div>

        {/* Weekly Result Video Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
            <span className="mr-2">•</span>
            Апталық нәтижесі
          </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${extractYoutubeId(week.result_url)}`}
              title="Апта видеосы"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        {/* Student Works Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-black mb-8 flex items-center">
            <span className="mr-2">•</span>
            Оқушылардың шығармашылығы
          </h2>
          
          {materials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...winners, ...others].map((material) => (
                <div 
                  key={material.id} 
                  className={`bg-gray-50 rounded-lg flex flex-col overflow-hidden transition-all duration-200 hover:bg-gray-100 ${
                    material.is_winner ? 'ring-1 ring-black' : ''
                  }`}
                >
                  {/* Winner Badge */}
                  {material.is_winner && (
                    <div className="absolute top-3 left-3 z-10 bg-black text-white text-xs px-3 py-1 rounded-full flex items-center">
                      ★ Жеңімпаз
                    </div>
                  )}
                  
                  {/* Preview */}
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    {material.material_type === 'youtube' && (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${extractYoutubeId(material.url)}`}
                        title={material.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    )}
                    {material.material_type === 'image' && (
                      <img 
                        src={material.url} 
                        alt={material.title} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    )}
                    {material.material_type === 'pdf' && (
                      <a 
                        href={material.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex flex-col items-center justify-center w-full h-full"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-10 w-10 text-gray-500 mb-2" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <span className="text-gray-900 font-medium">PDF</span>
                      </a>
                    )}
                    {material.material_type === 'video' && (
                      <video 
                        controls 
                        className="max-h-full max-w-full" 
                        src={material.url} 
                      />
                    )}
                    {(material.material_type !== 'youtube' && 
                      material.material_type !== 'image' && 
                      material.material_type !== 'pdf' && 
                      material.material_type !== 'video') && (
                      <a 
                        href={material.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex flex-col items-center justify-center w-full h-full"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-10 w-10 text-gray-500 mb-2" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <span className="text-gray-900 font-medium">Сілтеме</span>
                      </a>
                    )}
                  </div>
                  
                  {/* Information */}
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="text-sm font-medium text-gray-900 mr-auto">
                        {material.student_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(material.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-medium text-black mb-1">
                      {material.title}
                    </h3>
                    
                    <div className="text-xs text-gray-500 mb-3">
                      {materialTypeMap[material.material_type] || material.material_type}
                    </div>
                    
                    <a 
                      href={material.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="mt-2 text-black hover:underline text-sm font-medium inline-flex items-center"
                    >
                      Ашу
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-3 w-3 ml-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M14 5l7 7m0 0l-7 7m7-7H3" 
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Жұмыстар әлі жоқ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeekLandingPage;