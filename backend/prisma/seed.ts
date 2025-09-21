import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario de prueba
  const hashedPassword = await bcrypt.hash('123456', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@devtalles.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@devtalles.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'DevTalles',
      role: 'ADMIN',
    },
  });

  console.log('✅ Usuario creado:', user.email);

  // Crear categorías
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'react' },
      update: {},
      create: {
        name: 'React',
        slug: 'react',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: {
        name: 'TypeScript',
        slug: 'typescript',
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'backend' },
      update: {},
      create: {
        name: 'Backend',
        slug: 'backend',
        isActive: true,
      },
    }),
  ]);

  console.log('✅ Categorías creadas:', categories.length);

  // Crear posts de ejemplo
  const posts = [
    {
      title: 'Introducción a React Hooks',
      slug: 'introduccion-a-react-hooks',
      content: `
        <h2>¿Qué son los React Hooks?</h2>
        <p>Los React Hooks son una característica introducida en React 16.8 que permiten usar estado y otras características de React en componentes funcionales.</p>
        
        <h3>Hooks más comunes</h3>
        <ul>
          <li><strong>useState:</strong> Para manejar estado local</li>
          <li><strong>useEffect:</strong> Para efectos secundarios</li>
          <li><strong>useContext:</strong> Para consumir contexto</li>
        </ul>
        
        <h3>Ejemplo básico</h3>
        <pre><code>const [count, setCount] = useState(0);</code></pre>
      `,
      description:
        'Aprende los fundamentos de los hooks en React y cómo mejorar tu código.',
      image: '/devi1.png',
      categoryIds: [categories[0].id], // React
    },
    {
      title: 'Next.js 15: Nuevas Características',
      slug: 'nextjs-15-nuevas-caracteristicas',
      content: `
        <h2>¿Qué hay de nuevo en Next.js 15?</h2>
        <p>Next.js 15 trae muchas mejoras y nuevas características que hacen el desarrollo más eficiente.</p>
        
        <h3>Principales mejoras</h3>
        <ul>
          <li>Mejor rendimiento en desarrollo</li>
          <li>App Router mejorado</li>
          <li>Nuevas funciones de caching</li>
        </ul>
      `,
      description:
        'Explora las nuevas características y mejoras de Next.js 15.',
      image: '/devi2.png',
      categoryIds: [categories[1].id], // Next.js
    },
    {
      title: 'TypeScript para Principiantes',
      slug: 'typescript-para-principiantes',
      content: `
        <h2>¿Por qué TypeScript?</h2>
        <p>TypeScript añade tipado estático a JavaScript, lo que ayuda a detectar errores temprano y mejora la experiencia de desarrollo.</p>
        
        <h3>Tipos básicos</h3>
        <ul>
          <li>string, number, boolean</li>
          <li>arrays y objetos</li>
          <li>interfaces y tipos personalizados</li>
        </ul>
      `,
      description: 'Guía completa para empezar con TypeScript desde cero.',
      image: '/devi3.png',
      categoryIds: [categories[2].id], // TypeScript
    },
    {
      title: 'Construyendo APIs con NestJS',
      slug: 'construyendo-apis-con-nestjs',
      content: `
        <h2>¿Qué es NestJS?</h2>
        <p>NestJS es un framework de Node.js que utiliza TypeScript y está inspirado en Angular.</p>
        
        <h3>Características principales</h3>
        <ul>
          <li>Decoradores y metadatos</li>
          <li>Inyección de dependencias</li>
          <li>Modular y escalable</li>
        </ul>
      `,
      description: 'Aprende a crear APIs robustas y escalables con NestJS.',
      image: '/devi1.png',
      categoryIds: [categories[3].id], // Backend
    },
  ];

  for (const postData of posts) {
    const { categoryIds, ...postInfo } = postData;

    const post = await prisma.post.upsert({
      where: { slug: postInfo.slug },
      update: {},
      create: {
        ...postInfo,
        userId: user.id,
      },
    });

    // Crear relaciones con categorías
    for (const categoryId of categoryIds) {
      await prisma.postCategory.upsert({
        where: {
          postId_categoryId: {
            postId: post.id,
            categoryId: categoryId,
          },
        },
        update: {},
        create: {
          postId: post.id,
          categoryId: categoryId,
        },
      });
    }

    console.log('✅ Post creado:', post.title);
  }

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
