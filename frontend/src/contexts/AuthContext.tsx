"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { getAuthUrl, AUTH_SETTINGS } from "@/config/auth";

// Tipos para el usuario y contexto de autenticación
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ) => Promise<boolean>;
  checkAuth: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URLs de la API - Configuradas desde el archivo de configuración
const API_URLS = {
  LOGIN: getAuthUrl("LOGIN"),
  REGISTER: getAuthUrl("REGISTER"),
  VALIDATE_TOKEN: getAuthUrl("VALIDATE_TOKEN"),
  REFRESH_TOKEN: getAuthUrl("REFRESH_TOKEN"),
};

// Provider del contexto de autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Función para obtener el token del localStorage
  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_SETTINGS.TOKEN_KEY);
    }
    return null;
  };

  // Función para guardar el token
  const setToken = (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_SETTINGS.TOKEN_KEY, token);
    }
  };

  // Función para eliminar el token
  const removeToken = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_SETTINGS.TOKEN_KEY);
      localStorage.removeItem(AUTH_SETTINGS.REFRESH_TOKEN_KEY);
    }
  };

  // Función para hacer requests autenticados
  const authenticatedRequest = async (
    url: string,
    options: RequestInit = {}
  ) => {
    const token = getToken();

    // Determinar si el body es FormData para no establecer Content-Type
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Solo agregar Content-Type si no es FormData
    if (!isFormData) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    return fetch(url, {
      ...options,
      headers,
    });
  };

  // Función para verificar la autenticación
  const checkAuth = async (): Promise<void> => {
    const token = getToken();

    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Solo hacer la validación si hay URL configurada
      if (API_URLS.VALIDATE_TOKEN) {
        const response = await authenticatedRequest(API_URLS.VALIDATE_TOKEN);

        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user || userData);
        } else {
          // Token inválido, limpiar
          removeToken();
          setUser(null);
        }
      } else {
        // Si no hay URL configurada, simular que el token es válido
        // Esto es temporal hasta que configures las URLs
        console.warn("API_URLS.VALIDATE_TOKEN no está configurada");
      }
    } catch (error) {
      console.error("Error validating token:", error);
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Función de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!API_URLS.LOGIN) {
        console.warn("API_URLS.LOGIN no está configurada");
        // Simulación temporal para desarrollo
        const mockUser: User = {
          id: "1",
          email,
          firstName: "Usuario",
          lastName: "Demo",
          username: "usuario_demo",
          role: "user",
        };
        setUser(mockUser);
        setToken("mock_token_" + Date.now());
        return true;
      }

      const response = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Asumiendo que tu API de Nest.js devuelve { token, refreshToken?, user }
        setToken(data.token || data.access_token);

        if (data.refreshToken || data.refresh_token) {
          localStorage.setItem(
            AUTH_SETTINGS.REFRESH_TOKEN_KEY,
            data.refreshToken || data.refresh_token
          );
        }

        setUser(data.user);
        return true;
      } else {
        const errorData = await response.json();
        console.error("Login error:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  // Función de registro
  const register = async (
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    username: string
  ): Promise<boolean> => {
    try {
      if (!API_URLS.REGISTER) {
        console.warn("API_URLS.REGISTER no está configurada");
        return false;
      }

      const response = await fetch(API_URLS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          firstName: firstname,
          lastName: lastname,
          username,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Después del registro exitoso, automáticamente hacer login
        if (data.token || data.access_token) {
          setToken(data.token || data.access_token);
          setUser(data.user);
        }

        return true;
      } else {
        const errorData = await response.json();
        console.error("Register error:", errorData);
        return false;
      }
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  // Función de logout
  const logout = (): void => {
    removeToken();
    setUser(null);
    router.push(AUTH_SETTINGS.DEFAULT_REDIRECT_AFTER_LOGOUT);
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    checkAuth();
  }, []);

  // Interceptor para manejar tokens expirados (opcional)
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.status === 401) {
        logout();
      }
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto de autenticación
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Hook para requests autenticados
export function useAuthenticatedRequest() {
  const getToken = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(AUTH_SETTINGS.TOKEN_KEY);
    }
    return null;
  };

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = getToken();

    // Determinar si el body es FormData para no establecer Content-Type
    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Solo agregar Content-Type si no es FormData
    if (!isFormData) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si la respuesta es 401, disparar evento para logout automático
    if (response.status === 401) {
      window.dispatchEvent(
        new CustomEvent("auth:unauthorized", {
          detail: { status: 401 },
        })
      );
    }

    return response;
  };

  return { authenticatedFetch };
}
