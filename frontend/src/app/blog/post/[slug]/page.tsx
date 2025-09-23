'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
import { ArrowLeft, Heart, MessageCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    PostSkeleton,
    CommentsSkeleton,
    TableOfContentsSkeleton,
} from '@/components/Skeleton';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Post {
    id: number;
    title: string;
    slug: string;
    description: string;
    content: string;
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
    comments: Comments[];
    liked: boolean;
    related: Related[];
}

interface Related {
    slug: string;
    title: string;
    image: string;
}

interface Categories {
    id: number;
    name: string;
}

interface Comments {
    data: Datum[];
    meta: {
        total: number;
        totalPages: number;
        currentPage: number;
    };
}

export interface Datum {
    id: number;
    postId: number;
    userId: number;
    parentId: null;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: number;
        username: string;
        profilePicture: null;
    };
}

export default function PostPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [comments, setComments] = useState<Array<Datum>>([]);

    const fetchPost = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}post/${slug}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                }
            );
            if (!response.ok) {
                if (response.status === 404) {
                    router.replace('/not-found');
                    setLoading(false);
                    return;
                }
                throw new Error('Failed to fetch post');
            }
            const data = await response.json();
            setPost(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session, slug]);

    // Fetch comments
    const fetchComments = async () => {
        if (!slug) return;

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}comment/post/${slug}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }
            const data = await response.json();
            setComments(data.data);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : 'An error occurred'
            );
            setComments([]);
        } finally {
            setCommentsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, session]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<{ text: string }>();

    const [processedContent, setProcessedContent] = useState(
        post?.content || ''
    );
    const [menuItems, setMenuItems] = useState<
        Array<{ text: string; id: string; level: number }>
    >([]);

    useEffect(() => {
        if (!post || typeof window === 'undefined') return;
        const parser = new window.DOMParser();
        const doc = parser.parseFromString(post.content, 'text/html');
        const headings = doc.querySelectorAll('h2, h3, h4');
        headings.forEach((h, index) => {
            h.id = `heading-${index}`;
        });
        setProcessedContent(doc.body.innerHTML);
        setMenuItems(
            Array.from(headings).map((h, index) => ({
                text: h.textContent || '',
                id: `heading-${index}`,
                level: parseInt(h.tagName.charAt(1)),
            }))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [post?.content]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-red-500">Error: {error}</div>
            </div>
        );
    }

    if (!post) {
        // router.replace('/not-found');
        return null;
    }

    const handleLike = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}post/${post.liked ? 'unlike' : 'like'}/${post.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to like post');
            }

            fetchPost();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const onCommentSubmit = async (data: { text: string }) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}comment/post/${slug}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                    body: JSON.stringify({
                        content: data.text,
                        userId: session?.user?.user.id,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to submit comment');
            }

            fetchComments();
            reset();
        } catch (err) {
            console.error('Error submitting comment:', err);
            reset();
        }
    };

    return (
        <>
            {/* Contenido principal */}
            <div className="relative mx-auto max-w-5xl z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0">
                <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <main className="lg:col-span-3">
                        {/* Botón de volver */}
                        <Button
                            variant="ghost"
                            className="mb-8 text-white hover:bg-white/10"
                            asChild>
                            <a href="/blog" className="flex items-center gap-2">
                                <ArrowLeft size={16} />
                                Volver al blog
                            </a>
                        </Button>

                        {/* Imagen del post */}
                        <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
                            {post.image ? (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex bg-accent/80 items-center justify-center">
                                    <span className="text-sm text-white/60 line-clamp-1">
                                        Sin imagen
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Contenido del post */}
                        <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                            {loading ? (
                                <CardContent className="p-6">
                                    <PostSkeleton />
                                </CardContent>
                            ) : (
                                <>
                                    <CardHeader>
                                        <ShinyText
                                            text={post.title}
                                            className="text-3xl font-bold text-white mb-4"
                                        />
                                        <div className="flex items-center gap-4 text-white/60 text-sm">
                                            <span>
                                                Por {post.user.username}
                                            </span>
                                            <span>
                                                {new Date(
                                                    post.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                                {post.categories?.map(
                                                    (cat, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                                            {cat.name}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div
                                            className="prose prose-invert max-w-none"
                                            dangerouslySetInnerHTML={{
                                                __html: processedContent,
                                            }}
                                        />
                                    </CardContent>
                                </>
                            )}
                        </Card>

                        {/* Like button */}
                        <div className="mt-8 text-center">
                            <span className="text-white mr-4">
                                Likes: {post._count.likes}
                            </span>
                            {session?.user ? (
                                <Button
                                    onClick={handleLike}
                                    variant="ghost"
                                    className={`text-white hover:bg-white/10 ${
                                        post.liked ? 'text-red-500' : ''
                                    }`}>
                                    <Heart
                                        className={`h-5 w-5 mr-2 ${
                                            post.liked ? 'fill-current' : ''
                                        }`}
                                    />
                                    {post.liked ? 'Me gusta' : 'Dar like'}
                                </Button>
                            ) : null}
                        </div>

                        {post.related.length > 0 && (
                            <Card className="bg-black/20 backdrop-blur-sm border-white/10 mt-8">
                                <CardHeader>
                                    <CardTitle className="text-white">
                                        Publicaciones Relacionadas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-3 gap-4">
                                        {post.related.map(relatedPost => (
                                            <div
                                                key={relatedPost.slug}
                                                className="group">
                                                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                                                    {/* Image Container */}
                                                    <div className="relative aspect-[4/3] overflow-hidden">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={
                                                                relatedPost.image
                                                            }
                                                            alt={
                                                                relatedPost.title
                                                            }
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                        {/* Gradient Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                                    </div>
                                                    {/* Content */}
                                                    <div className="p-4">
                                                        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                                                            {relatedPost.title}
                                                        </h3>
                                                        {/* Action Button */}
                                                        <a
                                                            href={`/blog/post/${relatedPost.slug}`}
                                                            className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-purple-500/25 text-center block text-xs">
                                                            Leer más
                                                        </a>
                                                    </div>
                                                    {/* Decorative Elements */}
                                                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
                                                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Comments section */}
                        <Card className="bg-black/20 backdrop-blur-sm border-white/10 mt-8">
                            <CardHeader>
                                <ShinyText
                                    text="Comentarios"
                                    className="text-2xl font-bold text-white"
                                />
                            </CardHeader>
                            <CardContent>
                                {commentsLoading ? (
                                    <CommentsSkeleton />
                                ) : (
                                    <>
                                        {session?.user ? (
                                            <form
                                                onSubmit={handleSubmit(
                                                    onCommentSubmit
                                                )}
                                                className="mb-6">
                                                <textarea
                                                    placeholder="Escribe un comentario..."
                                                    {...register('text', {
                                                        required:
                                                            'El comentario es requerido',
                                                    })}
                                                    className="w-full h-24 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none"
                                                />
                                                {errors.text && (
                                                    <p className="text-red-400 text-sm mt-1">
                                                        {errors.text.message}
                                                    </p>
                                                )}

                                                <Button
                                                    type="submit"
                                                    className="mt-2">
                                                    <MessageCircle className="h-4 w-4 mr-2" />
                                                    Comentar
                                                </Button>
                                            </form>
                                        ) : (
                                            <p className="text-white/70 mb-4">
                                                Debes iniciar sesión para
                                                comentar.
                                            </p>
                                        )}

                                        <div className="space-y-4">
                                            {comments.length > 0 ? (
                                                comments.map(comment => (
                                                    <div
                                                        key={comment.id}
                                                        className="border-b border-white/10 pb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-semibold text-white">
                                                                {
                                                                    comment.user
                                                                        .username
                                                                }
                                                            </span>
                                                            <span className="text-sm text-white/60">
                                                                {
                                                                    comment.createdAt
                                                                        .toString()
                                                                        .split(
                                                                            'T'
                                                                        )[0]
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="text-white/80">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-white/70 mb-4">
                                                    No hay comentarios aún.
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </main>

                    {/* Table of Contents Sidebar */}
                    <aside className="lg:col-span-1">
                        {loading ? (
                            <TableOfContentsSkeleton />
                        ) : menuItems.length > 0 ? (
                            <Card className="bg-black/20 backdrop-blur-sm border-white/10 sticky top-40">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">
                                        Índice
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <nav className="space-y-2">
                                        {menuItems.map((item) => (
                                            <a
                                                key={item.id}
                                                href={`#${item.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    const el = document.getElementById(item.id);
                                                    if (el) {
                                                        const y = el.getBoundingClientRect().top + window.pageYOffset - 120;
                                                        window.scrollTo({ top: y, behavior: 'smooth' });
                                                    }
                                                }}
                                                className={`block text-sm text-white/70 hover:text-white transition-colors ${
                                                    item.level === 2
                                                        ? 'ml-0'
                                                        : item.level === 3
                                                        ? 'ml-4'
                                                        : 'ml-8'
                                                }`}
                                            >
                                                {item.text}
                                            </a>
                                        ))}
                                    </nav>
                                </CardContent>
                            </Card>
                        ) : null}
                    </aside>
                </div>
            </div>
        </>
    );
}
