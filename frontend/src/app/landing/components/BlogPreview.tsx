'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Post {
    id: number;
    title: string;
    slug: string;
    description: string;
    createdAt: string;
    user: {
        username: string;
    };
    _count: {
        comments: number;
        likes: number;
    };
    image: string;
    categories: Categories[];
}

interface Categories {
    id: number;
    name: string;
}

export default function BlogPreview() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}post?limit=3`);
                const data = await response.json();
                setPosts(data.data);
            } catch {
                toast.error('Error fetching posts');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <section className="py-16">
                <div className="mx-auto max-w-5xl px-6">
                    <h2 className="text-center text-3xl font-semibold mb-8">Últimos Posts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader>
                                    <div className="h-48 bg-gray-300 rounded"></div>
                                    <div className="h-6 bg-gray-300 rounded mt-4"></div>
                                    <div className="h-4 bg-gray-300 rounded mt-2"></div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16">
            <div className="mx-auto max-w-5xl px-6">
                <h2 className="text-center text-3xl font-semibold mb-8">Últimos Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {posts.map((post) => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="relative h-48 w-full mb-4">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <CardTitle className="text-lg">{post.title}</CardTitle>
                                <CardDescription>{post.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/blog/post/${post.slug}`}>
                                    <Button variant="outline" size="sm">
                                        Leer más
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="flex flex-row justify-end items-center gap-4">
                    <p className="text-white/70">¿Quieres ver más posts interesantes?</p>
                    <Button asChild size="lg">
                        <Link href="/blog">
                            Ir al Blog
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}