![Logo del proyecto](ubicación)

<hr />

### Índice

- [Descripción del proyecto](#Descripción-del-proyecto)
- [Funcionalidades del proyecto](#Funcionalidades-del-proyecto)
- [Acceso al proyecto](#Acceso-al-proyecto)
- [Tecnologías utilizadas](#Tecnologías-utilizadas)
- [Autores](#Autores)

## Descripción del proyecto

Descripción

![Mockup del proyecto](ubicación)

## Funcionalidades del proyecto

-
-
-

## Instalación

Clonar repositorio

### Backend

#### 1. Dirigirse a la carpeta backend

```bash
cd backend
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Duplicar el archivo `.env.example` a `.env`

```bash
cp .env.example .env
```

#### 4. Configurar las variables de entorno

```md
# Variables de entorno develop

PORT=5432
DATABASE_URL=postgresql://postgres:admin@localhost:5431/devtalles-blog?schema=public
JWT_SECRET=MYSECRET
```

#### 5. Levantar base de datos

```bash
docker compose up -d
```

#### 6. Generar el cliente de Prisma

```bash
npx prisma generate
```

#### 7. Ejecutar las migraciones

```bash
npx prisma migrate dev
```

#### 8. Ejecutar la aplicacion

```bash
npm run dev
```

#### Opcional Setup Oauth Discord

Si se quiere usar el Oauth de discord, seguir la configuración : `/backend/DISCORD_OAUTH_SETUP.md` [Discord Oauth Setup](/backend/DISCORD_OAUTH_SETUP.md)

## Acceso al proyecto

[Demo](enlace)

## Tecnologías utilizadas

-
-
-

## Autores

| [<img src='https://www.github.com/zidjian.png' width=115><br><sub>Waldir Maidana </sub>](https://github.com/zidjian) |
| :------------------------------------------------------------------------------------------------------------------: |
