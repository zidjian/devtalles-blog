import { NextResponse } from 'next/server';

// Mock data (same as in posts API)
const blogPosts = [
    {
        id: 1,
        title: 'Introducción a React Hooks',
        description:
            'Aprende los fundamentos de los hooks en React y cómo mejorar tu código.',
        date: '2023-10-01',
        author: 'Dev Talles',
        image: '/devi1.png',
        category: 'React',
    },
    {
        id: 2,
        title: 'Optimización de Performance en Next.js',
        description:
            'Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones Next.js.',
        date: '2023-09-15',
        author: 'Dev Talles',
        image: '/devi2.png',
        category: 'Next.js',
    },
    {
        id: 3,
        title: 'Diseño de APIs RESTful',
        description:
            'Mejores prácticas para diseñar APIs que sean escalables y mantenibles.',
        date: '2023-08-30',
        author: 'Dev Talles',
        image: '/devi3.png',
        category: 'Backend',
    },
    {
        id: 4,
        title: 'Introducción a TypeScript',
        description:
            'Aprende los fundamentos de TypeScript para mejorar tu desarrollo en JavaScript.',
        date: '2023-08-15',
        author: 'Dev Talles',
        image: '/devi1.png',
        category: 'TypeScript',
    },
    {
        id: 5,
        title: 'Tailwind CSS Avanzado',
        description:
            'Técnicas avanzadas para crear diseños responsivos con Tailwind CSS.',
        date: '2023-07-30',
        author: 'Dev Talles',
        image: '/devi2.png',
        category: 'CSS',
    },
    {
        id: 6,
        title: 'Node.js y Express',
        description: 'Construye APIs robustas con Node.js y Express.',
        date: '2023-07-15',
        author: 'Dev Talles',
        image: '/devi3.png',
        category: 'Backend',
    },
    {
        id: 7,
        title: 'Testing en React con Jest',
        description:
            'Aprende a escribir tests efectivos para tus componentes de React usando Jest.',
        date: '2023-07-01',
        author: 'Dev Talles',
        image: '/devi1.png',
        category: 'React',
    },
    {
        id: 8,
        title: 'Animaciones con Framer Motion',
        description:
            'Crea animaciones fluidas y atractivas en tus proyectos React.',
        date: '2023-06-15',
        author: 'Dev Talles',
        image: '/devi2.png',
        category: 'React',
    },
    {
        id: 9,
        title: 'Autenticación en NextAuth.js',
        description:
            'Implementa autenticación segura y moderna en tus apps Next.js.',
        date: '2023-06-01',
        author: 'Dev Talles',
        image: '/devi3.png',
        category: 'Next.js',
    },
    {
        id: 10,
        title: 'Consumo de APIs con SWR',
        description:
            'Optimiza el consumo de datos en React y Next.js usando SWR.',
        date: '2023-05-15',
        author: 'Dev Talles',
        image: '/devi1.png',
        category: 'React',
    },
    {
        id: 11,
        title: 'Deploy en Vercel',
        description:
            'Guía paso a paso para desplegar tus proyectos Next.js en Vercel.',
        date: '2023-05-01',
        author: 'Dev Talles',
        image: '/devi2.png',
        category: 'Next.js',
    },
    {
        id: 12,
        title: 'Gestión de estado con Redux Toolkit',
        description:
            'Simplifica la gestión de estado en aplicaciones React modernas.',
        date: '2023-04-15',
        author: 'Dev Talles',
        image: '/devi3.png',
        category: 'React',
    },
    {
        id: 13,
        title: 'SEO en Next.js',
        description:
            'Mejora el posicionamiento de tus páginas con buenas prácticas de SEO.',
        date: '2023-04-01',
        author: 'Dev Talles',
        image: '/devi1.png',
        category: 'Next.js',
    },
    {
        id: 14,
        title: 'Formularios con React Hook Form',
        description:
            'Crea formularios robustos y fáciles de mantener en React.',
        date: '2023-03-15',
        author: 'Dev Talles',
        image: '/devi2.png',
        category: 'React',
    },
    {
        id: 15,
        title: 'Estilos con Styled Components',
        description:
            'Utiliza Styled Components para estilos dinámicos en React.',
        date: '2023-03-01',
        author: 'Dev Talles',
        image: '/devi3.png',
        category: 'CSS',
    },
];

export async function GET() {
    const uniqueCategories = Array.from(
        new Set(blogPosts.map(post => post.category))
    );
    const categories = [
        ...uniqueCategories.map((cat, index) => ({ id: index + 2, name: cat })),
    ];
    return NextResponse.json({ categories });
}
