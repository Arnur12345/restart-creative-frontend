const API_BASE_URL = 'https://restart-creative.onrender.com/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`, 
        LOGOUT: `${API_BASE_URL}/auth/logout`,
        ME: `${API_BASE_URL}/auth/me`
    },
    ADMIN: {
        USERS: `${API_BASE_URL}/admin/users`,
        THEME_WEEKS: `${API_BASE_URL}/admin/theme-weeks`,
        VIDEOS: `${API_BASE_URL}/admin/videos`,
        MATERIALS: `${API_BASE_URL}/admin/materials`,
        UPDATE_MATERIAL: (id) => `${API_BASE_URL}/admin/materials/${id}`
    },
    VIDEOS: {
        LIST: `${API_BASE_URL}/videos`,
        CREATE: `${API_BASE_URL}/videos`,
        DETAIL: (id) => `${API_BASE_URL}/videos/${id}`,
        VOTE: (id) => `${API_BASE_URL}/videos/${id}/vote`
    },
    THEME_WEEKS: {
        LIST: `${API_BASE_URL}/theme-weeks`,
        DETAIL: (id) => `${API_BASE_URL}/theme-weeks/${id}`
    },
    MATERIALS: {
        LIST: `${API_BASE_URL}/theme-weeks/materials`
    }
};

export const APP_CONFIG = {
    APP_NAME: 'Restart Creative',
    LOGO_PATH: '/assets/logo.png'
}; 