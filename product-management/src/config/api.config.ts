export const API_CONFIG = {
  BASE_URL: 'https://localhost:44332/api',
  ENDPOINTS: {
    CATEGORIES: '/Dictionaries/Category'
  }
};

export const getFullUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`; 