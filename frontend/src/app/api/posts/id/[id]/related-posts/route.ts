import { NextResponse } from 'next/server';

// Mock data - same as in other routes
const blogPosts = [
  {
    id: 1,
    title: "Introducción a React Hooks",
    slug: "introduccion-a-react-hooks",
    description: "Aprende los fundamentos de los hooks en React y cómo mejorar tu código.",
    date: "2023-10-01",
    author: "Dev Talles",
    image: "/devi1.png",
    categories: ["React"],
    content: `<p>Los React Hooks son una característica introducida en React 16.8...</p>`,
  },
  {
    id: 2,
    title: "Optimización de Performance en Next.js",
    slug: "optimizacion-de-performance-en-nextjs",
    description: "Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones Next.js.",
    date: "2023-09-15",
    author: "Dev Talles",
    image: "/devi2.png",
    categories: ["Next.js"],
    content: `<p>Next.js ofrece varias técnicas de optimización...</p>`,
  },
  {
    id: 3,
    title: "Diseño de APIs RESTful",
    slug: "diseno-de-apis-restful",
    description: "Mejores prácticas para diseñar APIs que sean escalables y mantenibles.",
    date: "2023-08-30",
    author: "Dev Talles",
    image: "/devi3.png",
    categories: ["Backend"],
    content: `<p>Diseñar una API RESTful requiere seguir ciertos principios...</p>`,
  },
  // Add more posts as needed
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const postId = parseInt(id);

  // Find the current post
  const currentPost = blogPosts.find((p) => p.id === postId);

  if (!currentPost) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  
  return NextResponse.json({ relatedPosts: blogPosts });
}