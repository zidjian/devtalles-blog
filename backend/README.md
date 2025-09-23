![Logo del proyecto](/public/devtalles.png)

<hr />

### Índice

- [Descripción del proyecto](#Descripción-del-proyecto)
- [Desplegar el proyecto](#Desplegar-el-proyecto)

## Descripción del proyecto

Este es el backend de la plataforma **DevTalles**, un blog dedicado al desarrollo web. La aplicación permite a los usuarios explorar artículos, categorías y contenido. Incluye funcionalidades de autenticación, gestión de posts, categorías y un dashboard administrativo.

## Desplegar el proyecto

1. Clonar el repositorio
2. Instalar las dependencias `npm install`
3. Clonar el archivo .env.template a .env y configurar las variables de entorno
4. Levantar base de datos`docker compose up -d`
4. Generar el cliente de Prisma`npx prisma generate`
4. Ejecutar las migraciones`npx prisma migrate dev`
4. Ejecutar el proyecto con `npm run dev`
