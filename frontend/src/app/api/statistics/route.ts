import { NextRequest, NextResponse } from 'next/server';

// Mock data
const posts = [
    {
        id: 1,
        title: "Introducción a React Hooks",
        likes: 45,
        date: "2023-10-01",
    },
    {
        id: 2,
        title: "Optimización de Performance en Next.js",
        likes: 32,
        date: "2023-09-15",
    },
    { id: 3, title: "Diseño de APIs RESTful", likes: 28, date: "2023-08-30" },
    {
        id: 4,
        title: "Introducción a TypeScript",
        likes: 50,
        date: "2023-08-15",
    },
    { id: 5, title: "Tailwind CSS Avanzado", likes: 22, date: "2023-07-30" },
];

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const filtered = posts.filter((post) => {
        const postDate = new Date(post.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && postDate < start) return false;
        if (end && postDate > end) return false;
        return true;
    });

    const totalPosts = filtered.length;
    const totalLikes = filtered.reduce((sum, post) => sum + post.likes, 0);

    return NextResponse.json({ totalPosts, totalLikes });
}