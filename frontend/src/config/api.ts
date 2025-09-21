// Configuración centralizada para URLs de API
export const API_CONFIG = {
  // URL base del backend
  BACKEND_BASE_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",

  // Endpoints específicos
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: "/api/auth/login",
      REGISTER: "/api/auth/register",
      VALIDATE_TOKEN: "/api/auth/validate-token",
      REFRESH_TOKEN: "/api/auth/refresh-token",
    },

    // Posts
    POSTS: {
      BASE: "/api/post",
      BY_ID: (id: string) => `/api/post/id/${id}`,
      BY_SLUG: (slug: string) => `/api/post/${slug}`,
    },

    // Categories
    CATEGORIES: {
      BASE: "/api/category",
      BY_ID: (id: string) => `/api/category/id/${id}`,
    },

    // Comments
    COMMENTS: {
      BY_POST_SLUG: (slug: string) => `/api/post/${slug}/comments`,
    },
  },
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BACKEND_BASE_URL}${endpoint}`;
};

// Función helper para endpoints de frontend (proxy)
export const buildFrontendApiUrl = (endpoint: string): string => {
  return `/api${endpoint}`;
};
