// Configuración de URLs para la API de autenticación
// Reemplaza estas URLs vacías con las URLs reales de tu API de Nest.js

export const AUTH_CONFIG = {
  // URL base de tu API de Nest.js (ejemplo: 'http://localhost:3001' o 'https://tu-api.com')
  API_BASE_URL: "http://localhost:3000/api",

  // Endpoints específicos de autenticación
  ENDPOINTS: {
    // Endpoint para iniciar sesión (POST)
    // Ejemplo: '/auth/login'
    LOGIN: "/auth/login",

    // Endpoint para registrar usuario (POST)
    // Ejemplo: '/auth/register'
    REGISTER: "/auth/register",

    // Endpoint para validar token (GET o POST)
    // Ejemplo: '/auth/validate' o '/auth/me'
    VALIDATE_TOKEN: "/auth/validate",

    // Endpoint para refrescar token (POST) - opcional
    // Ejemplo: '/auth/refresh'
    REFRESH_TOKEN: "/auth/refresh",

    // Endpoint para cerrar sesión (POST) - opcional
    // Ejemplo: '/auth/logout'
    LOGOUT: "/auth/logout",
  },
};

// Helper para construir URLs completas
export const getAuthUrl = (
  endpoint: keyof typeof AUTH_CONFIG.ENDPOINTS
): string => {
  const baseUrl = AUTH_CONFIG.API_BASE_URL;
  const endpointPath = AUTH_CONFIG.ENDPOINTS[endpoint];

  if (!baseUrl || !endpointPath) {
    return "";
  }

  // Asegurarse de que no haya doble slash
  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const cleanEndpoint = endpointPath.startsWith("/")
    ? endpointPath
    : `/${endpointPath}`;

  return `${cleanBaseUrl}${cleanEndpoint}`;
};

// Configuración adicional
export const AUTH_SETTINGS = {
  // Nombre de las claves en localStorage
  TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",

  // Tiempo de expiración del token en milisegundos (opcional)
  // Ejemplo: 24 horas = 24 * 60 * 60 * 1000
  TOKEN_EXPIRY_TIME: 24 * 60 * 60 * 1000,

  // Rutas de redirección
  DEFAULT_REDIRECT_AFTER_LOGIN: "/blog",
  DEFAULT_REDIRECT_AFTER_LOGOUT: "/blog/login",
  LOGIN_PAGE: "/blog/login",
};
