"use client";

import React, { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Componente que protege rutas requiriendo autenticación
 * Si el usuario no está autenticado, lo redirige al login
 */
export function ProtectedRoute({
  children,
  fallback = null,
  redirectTo = "/blog/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Verificando autenticación...</div>
      </div>
    );
  }

  // Si no está autenticado, mostrar fallback o null
  if (!isAuthenticated) {
    return fallback;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
}

/**
 * HOC (Higher Order Component) para proteger páginas completas
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    redirectTo?: string;
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute
        fallback={options?.fallback}
        redirectTo={options?.redirectTo}
      >
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Componente para proteger acciones específicas (botones, formularios, etc.)
 * En lugar de redirigir, muestra un mensaje o botón de login
 */
interface ProtectedActionProps {
  children: ReactNode;
  fallback?: ReactNode;
  showLoginPrompt?: boolean;
  onUnauthorizedClick?: () => void;
}

export function ProtectedAction({
  children,
  fallback,
  showLoginPrompt = true,
  onUnauthorizedClick,
}: ProtectedActionProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleUnauthorizedClick = () => {
    if (onUnauthorizedClick) {
      onUnauthorizedClick();
    } else {
      router.push("/blog/login");
    }
  };

  if (isLoading) {
    return (
      <div className="inline-flex items-center text-white/60">
        <span>Cargando...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    if (showLoginPrompt) {
      return (
        <button
          onClick={handleUnauthorizedClick}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Iniciar sesión para continuar
        </button>
      );
    }

    return null;
  }

  return <>{children}</>;
}

/**
 * Hook para verificar si una acción requiere autenticación
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const requireAuth = (callback: () => void, redirectTo = "/blog/login") => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    callback();
  };

  return { requireAuth, isAuthenticated, isLoading };
}
