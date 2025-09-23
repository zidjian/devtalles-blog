# Discord OAuth Setup Guide

## Configuración de Discord OAuth

Para usar el login con Discord, necesitas configurar una aplicación en Discord Developer Portal.

### 1. Crear una aplicación en Discord

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Haz clic en "New Application"
3. Dale un nombre a tu aplicación
4. Ve a la sección "OAuth2" en el menú lateral

### 2. Configurar OAuth2

1. En "Redirects", agrega: `http://localhost:3000/api/auth/discord/callback`
2. Copia el "Client ID" y "Client Secret"

### 3. Variables de entorno

Agrega estas variables a tu archivo `.env`:

```env
DISCORD_CLIENT_ID="tu-client-id-aqui"
DISCORD_CLIENT_SECRET="tu-client-secret-aqui"
DISCORD_CALLBACK_URL="http://localhost:3000/api/auth/discord/callback"
```

### 4. Endpoints disponibles

- **GET** `/api/auth/discord` - Inicia el proceso de login con Discord
- **GET** `/api/auth/discord/callback` - Callback de Discord OAuth

### 5. Flujo de autenticación

1. El usuario visita `/api/auth/discord`
2. Se redirige a Discord para autorizar la aplicación
3. Discord redirige de vuelta a `/api/auth/discord/callback`
4. Se crea o actualiza el usuario en la base de datos
5. Se retorna un JWT token

### 6. Campos de usuario para Discord

Los usuarios creados con Discord tendrán:
- `discordId`: ID único de Discord
- `discordUsername`: Nombre de usuario de Discord
- `discordAvatar`: Avatar de Discord
- `email`: Email de Discord (si está disponible)
- `username`: Usado como nombre de usuario por defecto
- `firstName`: Usado como nombre por defecto
- `lastName`: Vacío por defecto
- `password`: Null (no se requiere contraseña)

### 7. Vinculación de cuentas

Si un usuario ya existe con el mismo email, se vinculará la cuenta Discord a la cuenta existente.
