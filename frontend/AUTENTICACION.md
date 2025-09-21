# Sistema de Autenticación Integrado

Este documento explica cómo configurar y usar el sistema de autenticación personalizado que se integra con tu API de Nest.js.

## 📋 Configuración

### 1. Configurar URLs de la API

Edita el archivo `src/config/auth.ts` y completa las URLs de tu API de Nest.js:

```typescript
export const AUTH_CONFIG = {
  // URL base de tu API de Nest.js
  API_BASE_URL: "http://localhost:3001", // ← Cambia esto

  ENDPOINTS: {
    LOGIN: "/auth/login", // ← Cambia esto
    REGISTER: "/auth/register", // ← Cambia esto
    VALIDATE_TOKEN: "/auth/me", // ← Cambia esto
    REFRESH_TOKEN: "/auth/refresh", // ← Opcional
    LOGOUT: "/auth/logout", // ← Opcional
  },
};
```

### 2. Formato Esperado de Respuestas

Tu API de Nest.js debe devolver las siguientes estructuras:

#### Login/Register (POST)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "opcional_refresh_token",
  "user": {
    "id": "123",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "user"
  }
}
```

#### Validar Token (GET/POST)

```json
{
  "user": {
    "id": "123",
    "email": "usuario@ejemplo.com",
    "name": "Nombre Usuario",
    "role": "user"
  }
}
```

## 🚀 Características Implementadas

### ✅ Rutas Protegidas

- **Crear Post**: `/blog/createpost/new` - Solo usuarios autenticados
- **Editar Post**: `/blog/createpost/[id]` - Solo usuarios autenticados
- **Crear Categoría**: `/blog/createcategory/new` - Solo usuarios autenticados
- **Editar Categoría**: `/blog/createcategory/[id]` - Solo usuarios autenticados

### ✅ Botones Protegidos

- **Botón "Crear Post"** en navbar y listado
- **Botón "Crear Categoría"** en listado
- **Botones "Editar/Eliminar"** en listado de categorías

### ✅ Funcionalidades

- **Login automático** después del registro
- **Redirección inteligente** después del login
- **Logout automático** cuando el token expira
- **Persistencia de sesión** en localStorage
- **Indicador visual** del usuario logueado en navbar

## 🛠️ Uso en Componentes

### Proteger una página completa:

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function MiPaginaProtegida() {
  return (
    <ProtectedRoute>
      <div>Contenido solo para usuarios autenticados</div>
    </ProtectedRoute>
  );
}
```

### Proteger un botón o acción:

```tsx
import { ProtectedAction } from "@/components/ProtectedRoute";

export default function MiComponente() {
  return (
    <ProtectedAction>
      <button>Solo usuarios autenticados ven esto</button>
    </ProtectedAction>
  );
}
```

### Usar el contexto de autenticación:

```tsx
import { useAuth } from "@/contexts/AuthContext";

export default function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido, {user?.name}!</p>
      ) : (
        <p>Por favor, inicia sesión</p>
      )}
    </div>
  );
}
```

### Hacer requests autenticados:

```tsx
import { useAuthenticatedRequest } from "@/contexts/AuthContext";

export default function MiComponente() {
  const { authenticatedFetch } = useAuthenticatedRequest();

  const crearPost = async () => {
    const response = await authenticatedFetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title: "Mi Post" }),
    });
    // El token se incluye automáticamente en el header Authorization
  };
}
```

## 🔧 Personalización

### Cambiar rutas de redirección:

Edita `src/config/auth.ts`:

```typescript
export const AUTH_SETTINGS = {
  DEFAULT_REDIRECT_AFTER_LOGIN: "/blog/dashboard", // ← Cambia esto
  DEFAULT_REDIRECT_AFTER_LOGOUT: "/blog/login", // ← Cambia esto
  LOGIN_PAGE: "/blog/login", // ← Cambia esto
};
```

### Cambiar nombres de las claves en localStorage:

```typescript
export const AUTH_SETTINGS = {
  TOKEN_KEY: "mi_app_token", // ← Cambia esto
  REFRESH_TOKEN_KEY: "mi_refresh", // ← Cambia esto
};
```

## 🔍 Flujo de Autenticación

1. **Usuario no autenticado** intenta acceder a ruta protegida
2. **Redirección automática** a `/blog/login`
3. **Usuario completa login** → Token guardado en localStorage
4. **Redirección** a la página original o dashboard
5. **Requests automáticos** incluyen token en header `Authorization: Bearer TOKEN`
6. **Si token expira** → Logout automático y redirección a login

## 🐛 Troubleshooting

### El login no funciona:

1. Verifica que `API_BASE_URL` y `LOGIN` estén correctos
2. Revisa la consola del navegador para errores
3. Confirma que tu API devuelve el formato JSON correcto

### Los botones protegidos no aparecen:

1. Verifica que el token esté guardado en localStorage
2. Revisa que `VALIDATE_TOKEN` endpoint funcione correctamente

### Logout automático inesperado:

1. Tu API está devolviendo 401 para requests autenticados
2. Verifica que el token se esté enviando correctamente
3. Confirma que el token no haya expirado

## 📝 Notas Importantes

- **Desarrollo**: Mientras las URLs estén vacías, se usa un usuario mock para desarrollo
- **Producción**: Asegúrate de configurar todas las URLs antes de desplegar
- **Seguridad**: Los tokens se guardan en localStorage (considera httpOnly cookies para mayor seguridad)
- **CORS**: Asegúrate de que tu API de Nest.js permita requests desde tu dominio de frontend
