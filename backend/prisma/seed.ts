import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed con 20 posts...");

  const password = await bcrypt.hash("123456", 10);

  // ===== Usuarios =====
  const admin = await prisma.user.upsert({
    where: { email: "admin@blog.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@blog.com",
      password,
      firstName: "Admin",
      lastName: "Blog",
      role: "ADMIN",
      bio: "Administrador del blog",
    },
  });

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "ana@example.com" },
      update: {},
      create: {
        username: "ana123",
        email: "ana@example.com",
        password,
        firstName: "Ana",
        lastName: "Pérez",
        bio: "Frontend developer apasionada por React.",
      },
    }),
    prisma.user.upsert({
      where: { email: "luis@example.com" },
      update: {},
      create: {
        username: "luisdev",
        email: "luis@example.com",
        password,
        firstName: "Luis",
        lastName: "Gómez",
        bio: "Backend developer especializado en Node y NestJS.",
      },
    }),
    prisma.user.upsert({
      where: { email: "maria@example.com" },
      update: {},
      create: {
        username: "maria98",
        email: "maria@example.com",
        password,
        firstName: "María",
        lastName: "López",
        bio: "Estudiante de ingeniería aprendiendo TypeScript.",
      },
    }),
    prisma.user.upsert({
      where: { email: "carlos@example.com" },
      update: {},
      create: {
        username: "carlospro",
        email: "carlos@example.com",
        password,
        firstName: "Carlos",
        lastName: "Ramírez",
        bio: "Apasionado por DevOps y la nube ☁️",
      },
    }),
  ]);

  // ===== Categorías =====
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "react" },
      update: {},
      create: { name: "React", slug: "react", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "typescript" },
      update: {},
      create: { name: "TypeScript", slug: "typescript", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "nestjs" },
      update: {},
      create: { name: "NestJS", slug: "nestjs", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "devops" },
      update: {},
      create: { name: "DevOps", slug: "devops", isActive: true },
    }),
    prisma.category.upsert({
      where: { slug: "general" },
      update: {},
      create: { name: "General", slug: "general", isActive: true },
    }),
  ]);

  // ===== 20 Posts =====
  const postsData = [
    // React
    {
      title: "Introducción a React",
      slug: "introduccion-a-react",
      description: "Primeros pasos con React y JSX.",
      content: "React es una librería de JavaScript para crear interfaces...",
      image: "/images/react1.png",
      userId: users[0].id,
      categoryIds: [categories[0].id],
    },
    {
      title: "React Hooks: useState y useEffect",
      slug: "react-hooks-usestate-useeffect",
      description: "Cómo manejar estado y efectos en componentes funcionales.",
      content: "useState permite crear estado local en componentes...",
      image: "/images/react2.png",
      userId: users[0].id,
      categoryIds: [categories[0].id],
    },
    {
      title: "Context API en React",
      slug: "context-api-en-react",
      description: "Compartir datos globales sin prop drilling.",
      content: "Context API evita tener que pasar props manualmente...",
      image: "/images/react3.png",
      userId: users[0].id,
      categoryIds: [categories[0].id],
    },
    {
      title: "React Router en la práctica",
      slug: "react-router-en-la-practica",
      description: "Aprende a navegar entre páginas con React Router.",
      content: "Con React Router podemos definir rutas y parámetros...",
      image: "/images/react4.png",
      userId: users[0].id,
      categoryIds: [categories[0].id],
    },
    // TypeScript
    {
      title: "Primeros pasos con TypeScript",
      slug: "primeros-pasos-con-typescript",
      description: "Instalación y compilación básica.",
      content: "TypeScript añade tipado estático a JavaScript...",
      image: "/images/ts1.png",
      userId: users[2].id,
      categoryIds: [categories[1].id],
    },
    {
      title: "Interfaces vs Tipos en TS",
      slug: "interfaces-vs-tipos-en-ts",
      description: "Diferencias y casos de uso.",
      content: "Las interfaces permiten extender, los tipos son más flexibles...",
      image: "/images/ts2.png",
      userId: users[2].id,
      categoryIds: [categories[1].id],
    },
    {
      title: "TypeScript con React",
      slug: "typescript-con-react",
      description: "Combina tipado fuerte con componentes.",
      content: "Usar TS con React ayuda a detectar errores en props...",
      image: "/images/ts3.png",
      userId: users[2].id,
      categoryIds: [categories[1].id, categories[0].id],
    },
    {
      title: "Decoradores en TypeScript",
      slug: "decoradores-en-typescript",
      description: "Funcionalidad avanzada para clases.",
      content: "Los decoradores permiten añadir metadatos a clases y métodos...",
      image: "/images/ts4.png",
      userId: users[2].id,
      categoryIds: [categories[1].id],
    },
    // NestJS
    {
      title: "NestJS: Introducción",
      slug: "nestjs-introduccion",
      description: "Qué es y por qué usar NestJS.",
      content: "NestJS es un framework para Node basado en TypeScript...",
      image: "/images/nest1.png",
      userId: users[1].id,
      categoryIds: [categories[2].id],
    },
    {
      title: "Controladores en NestJS",
      slug: "controladores-en-nestjs",
      description: "Aprende a crear endpoints.",
      content: "Un controlador define las rutas de tu aplicación...",
      image: "/images/nest2.png",
      userId: users[1].id,
      categoryIds: [categories[2].id],
    },
    {
      title: "Servicios e Inyección de Dependencias",
      slug: "servicios-inyeccion-nestjs",
      description: "Cómo organizar la lógica de negocio.",
      content: "Los servicios encapsulan lógica reutilizable...",
      image: "/images/nest3.png",
      userId: users[1].id,
      categoryIds: [categories[2].id],
    },
    {
      title: "Middlewares y Guards",
      slug: "middlewares-guards-nestjs",
      description: "Controla peticiones y seguridad.",
      content: "NestJS permite usar middlewares y guards para validar...",
      image: "/images/nest4.png",
      userId: users[1].id,
      categoryIds: [categories[2].id],
    },
    // DevOps
    {
      title: "Introducción a DevOps",
      slug: "introduccion-a-devops",
      description: "Qué es la cultura DevOps.",
      content: "DevOps busca unir desarrollo y operaciones...",
      image: "/images/devops1.png",
      userId: users[3].id,
      categoryIds: [categories[3].id],
    },
    {
      title: "CI/CD explicado",
      slug: "cicd-explicado",
      description: "Integración y despliegue continuos.",
      content: "Con pipelines de CI/CD automatizamos pruebas y despliegues...",
      image: "/images/devops2.png",
      userId: users[3].id,
      categoryIds: [categories[3].id],
    },
    {
      title: "Docker para principiantes",
      slug: "docker-para-principiantes",
      description: "Contenedores y su utilidad.",
      content: "Docker permite empaquetar apps con todas sus dependencias...",
      image: "/images/devops3.png",
      userId: users[3].id,
      categoryIds: [categories[3].id],
    },
    {
      title: "Kubernetes básico",
      slug: "kubernetes-basico",
      description: "Orquestación de contenedores.",
      content: "Kubernetes automatiza despliegues y escalado de contenedores...",
      image: "/images/devops4.png",
      userId: users[3].id,
      categoryIds: [categories[3].id],
    },
    // General
    {
      title: "Mejores prácticas de Git",
      slug: "mejores-practicas-git",
      description: "Commits claros y ramas organizadas.",
      content: "Un buen flujo de Git mejora la colaboración del equipo...",
      image: "/images/git.png",
      userId: admin.id,
      categoryIds: [categories[4].id],
    },
    {
      title: "Scrum en proyectos pequeños",
      slug: "scrum-en-proyectos-pequenos",
      description: "Cómo aplicar metodologías ágiles.",
      content: "Scrum ayuda a organizar equipos y entregas iterativas...",
      image: "/images/scrum.png",
      userId: admin.id,
      categoryIds: [categories[4].id],
    },
    {
      title: "Cómo prepararte para entrevistas técnicas",
      slug: "preparacion-entrevistas-tecnicas",
      description: "Tips para entrevistas de desarrollo.",
      content: "Practica algoritmos, repasa estructuras de datos...",
      image: "/images/interview.png",
      userId: admin.id,
      categoryIds: [categories[4].id],
    },
  ];

  for (const postData of postsData) {
    const { categoryIds, ...postInfo } = postData;
    const post = await prisma.post.upsert({
      where: { slug: postInfo.slug },
      update: {},
      create: { ...postInfo },
    });

    for (const categoryId of categoryIds) {
      await prisma.postCategory.upsert({
        where: { postId_categoryId: { postId: post.id, categoryId } },
        update: {},
        create: { postId: post.id, categoryId },
      });
    }
    console.log("✅ Post creado:", post.title);
  }

  // ===== Comentarios (ejemplo en 2 posts) =====
  const allPosts = await prisma.post.findMany();
  const allUsers = await prisma.user.findMany();

  for (const post of allPosts) {
    const commentsCount = Math.floor(Math.random() * 3) + 3;

    const commentsData = Array.from({ length: commentsCount }).map(() => {
      const randomUser = allUsers[Math.floor(Math.random() * allUsers.length)];
      const frases = [
        "Excelente explicación 👏",
        "Gracias, me sirvió mucho 🙌",
        "Me quedó mucho más claro el tema.",
        "Buen artículo, fácil de entender.",
        "Lo compartiré con mi equipo 🚀",
        "Me encantaría ver un ejemplo más avanzado.",
        "Muy útil para mi proyecto actual.",
        "Explicación muy clara, felicidades!",
      ];
      const content = frases[Math.floor(Math.random() * frases.length)];

      return {
        content,
        postId: post.id,
        userId: randomUser.id,
      };
    });

    await prisma.comment.createMany({ data: commentsData });
    console.log(`💬 Comentarios añadidos al post: ${post.title}`);
  }
  
  // ===== Likes =====
  const tsPost = await prisma.post.findUnique({
    where: { slug: "primeros-pasos-con-typescript" },
  });
  if (tsPost) {
    await prisma.like.createMany({
      data: [
        { postId: tsPost.id, userId: users[3].id },
        { postId: tsPost.id, userId: admin.id },
      ],
      skipDuplicates: true,
    });
  }

  console.log("🎉 Seed completado con 20 posts!");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
