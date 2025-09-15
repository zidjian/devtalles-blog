import { NextRequest, NextResponse } from 'next/server';

// Mock comments data - in a real app, this would be stored in a database
const commentsData: { [slug: string]: Array<{
  id: number;
  name: string;
  text: string;
  date: string;
}> } = {
  'introduccion-a-react-hooks': [
    {
      id: 1,
      name: "Usuario 1",
      text: "Excelente artículo sobre React Hooks!",
      date: "2023-10-02",
    },
    {
      id: 2,
      name: "Usuario 2",
      text: "Muy útil, gracias por la explicación.",
      date: "2023-10-03",
    },
  ],
  'optimizacion-de-performance-en-nextjs': [
    {
      id: 3,
      name: "Dev Frontend",
      text: "Las técnicas de optimización son muy útiles.",
      date: "2023-09-16",
    },
  ],
  'diseno-de-apis-restful': [
    {
      id: 4,
      name: "Backend Dev",
      text: "Buenas prácticas para APIs REST.",
      date: "2023-08-31",
    },
  ],
  // Add empty arrays for other posts
  'introduccion-a-typescript': [],
  'tailwind-css-avanzado': [],
  'nodejs-y-express': [],
  'testing-en-react-con-jest': [],
  'animaciones-con-framer-motion': [],
  'autenticacion-en-nextauthjs': [],
  'consumo-de-apis-con-swr': [],
  'deploy-en-vercel': [],
  'gestion-de-estado-con-redux-toolkit': [],
  'seo-en-nextjs': [],
  'formularios-con-react-hook-form': [],
  'estilos-con-styled-components': [],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const comments = commentsData[slug] || [];

  return NextResponse.json({ comments });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const body = await request.json();
    const { name, text } = body;

    if (!name || !text) {
      return NextResponse.json(
        { error: 'Name and text are required' },
        { status: 400 }
      );
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    // Initialize comments array if it doesn't exist
    if (!commentsData[slug]) {
      commentsData[slug] = [];
    }

    // Create new comment
    const newComment = {
      id: Date.now(), // Simple ID generation
      name: name.trim(),
      text: text.trim(),
      date: new Date().toISOString().split('T')[0],
    };

    // Add comment to the post
    commentsData[slug].push(newComment);

    return NextResponse.json({
      message: 'Comment added successfully',
      comment: newComment
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}