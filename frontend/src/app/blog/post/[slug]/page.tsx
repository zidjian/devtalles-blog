"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
  PostSkeleton,
  CommentsSkeleton,
  RelatedPostsSkeleton,
  TableOfContentsSkeleton,
} from "@/components/Skeleton";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    profilePicture: string | null;
  };
  image: string;
  categories: {
    id: number;
    name: string;
  }[];
  content: string;
  comments?: any;
  _count?: {
    comments: number;
    likes: number;
  };
}

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [comments, setComments] = useState<
    Array<{
      id: number;
      name: string;
      text: string;
      date: string;
    }>
  >([]);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.replace("/not-found");
            setLoading(false);
            return;
          }
          throw new Error("Failed to fetch post");
        }
        const data = await response.json();
        if (!data.post) {
          router.replace("/not-found");
          setLoading(false);
          return;
        }
        setPosts([data.post]); // Set as array for compatibility
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!slug) return;

      try {
        const response = await fetch(`/api/posts/${slug}/comments`);
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        // Set empty comments array on error
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [slug]);

  const post = posts.find((p) => p.slug === slug);

  const [liked, setLiked] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; text: string }>();

  const [processedContent, setProcessedContent] = useState(post?.content || "");
  const [menuItems, setMenuItems] = useState<
    Array<{ text: string; id: string; level: number }>
  >([]);

  useEffect(() => {
    if (!post || typeof window === "undefined") return;
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(post.content, "text/html");
    const headings = doc.querySelectorAll("h2, h3, h4");
    headings.forEach((h, index) => {
      h.id = `heading-${index}`;
    });
    setProcessedContent(doc.body.innerHTML);
    setMenuItems(
      Array.from(headings).map((h, index) => ({
        text: h.textContent || "",
        id: `heading-${index}`,
        level: parseInt(h.tagName.charAt(1)),
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.content]);

  useEffect(() => {
    if (post && post.categories.length > 0) {
      const fetchRelated = async () => {
        try {
          // Get posts from the same category
          const categoryId = post.categories[0].id;
          const response = await fetch(
            `/api/posts?categoryId=${categoryId}&limit=4`
          );
          if (response.ok) {
            const data = await response.json();
            // Filter out the current post and limit to 3
            const filtered =
              data.data?.filter((p: Post) => p.id !== post.id).slice(0, 3) ||
              [];
            setRelatedPosts(filtered);
          }
        } catch (error) {
          console.error("Error fetching related posts:", error);
        }
      };
      fetchRelated();
    }
  }, [post]);

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
    router.replace("/not-found");
    return null;
  }

  const handleLike = () => {
    setLiked(!liked);
  };

  const onCommentSubmit = async (data: { name: string; text: string }) => {
    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const result = await response.json();
      setComments([...comments, result.comment]);
      reset();
    } catch (err) {
      console.error("Error submitting comment:", err);
      // Fallback to local state update
      setComments([
        ...comments,
        {
          id: Date.now(),
          name: data.name,
          text: data.text,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
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
              asChild
            >
              <a href="/blog" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Volver al blog
              </a>
            </Button>

            {/* Imagen del post */}
            <div className="aspect-video relative mb-8 rounded-lg overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
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
                      <span>Por {post.user.username}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {post.categories?.map((cat, index) => (
                          <span
                            key={index}
                            className="bg-white/20 px-2 py-1 rounded-full text-xs"
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-white/80 text-lg">{post.description}</p>
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
              <Button
                onClick={handleLike}
                variant="ghost"
                className={`text-white hover:bg-white/10 ${
                  liked ? "text-red-500" : ""
                }`}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${liked ? "fill-current" : ""}`}
                />
                {liked ? "Me gusta" : "Dar like"}
              </Button>
            </div>
            {loading ? (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 mt-8">
                <CardHeader>
                  <CardTitle className="text-white">
                    Posts Relacionados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RelatedPostsSkeleton />
                </CardContent>
              </Card>
            ) : (
              relatedPosts.length > 0 && (
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 mt-8">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Posts Relacionados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="group">
                          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={relatedPost.image}
                                alt={relatedPost.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                              {/* Category Badge */}
                              <div className="absolute top-4 left-4">
                                <div className="flex flex-wrap gap-1">
                                  {relatedPost.categories?.map((cat, index) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30"
                                    >
                                      {cat.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {/* Content */}
                            <div className="p-4">
                              <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                                {relatedPost.title}
                              </h3>
                              <p className="text-white/70 text-xs mb-3 line-clamp-2 leading-relaxed">
                                {relatedPost.description}
                              </p>
                              {/* Action Button */}
                              <a
                                href={`/blog/post/${relatedPost.slug}`}
                                className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-purple-500/25 text-center block text-xs"
                              >
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
              )
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
                    {/* Comment form */}
                    <form
                      onSubmit={handleSubmit(onCommentSubmit)}
                      className="mb-6"
                    >
                      <Input
                        type="text"
                        placeholder="Tu nombre"
                        {...register("name", {
                          required: "El nombre es requerido",
                        })}
                        className="mb-2"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-sm mb-2">
                          {errors.name.message}
                        </p>
                      )}

                      <textarea
                        placeholder="Escribe un comentario..."
                        {...register("text", {
                          required: "El comentario es requerido",
                        })}
                        className="w-full h-24 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 resize-none"
                      />
                      {errors.text && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.text.message}
                        </p>
                      )}

                      <Button type="submit" className="mt-2">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comentar
                      </Button>
                    </form>

                    {/* Comments list */}
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="border-b border-white/10 pb-4"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-white">
                              {comment.name}
                            </span>
                            <span className="text-sm text-white/60">
                              {comment.date}
                            </span>
                          </div>
                          <p className="text-white/80">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </main>
          <aside className="lg:col-span-1">
            <Card className="bg-black/20 backdrop-blur-sm border-white/10 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Índice</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <TableOfContentsSkeleton />
                ) : (
                  <nav>
                    <ul className="space-y-2">
                      {menuItems.map((item) => (
                        <li
                          key={item.id}
                          className={
                            item.level === 2
                              ? "pl-0"
                              : item.level === 3
                              ? "pl-4"
                              : "pl-8"
                          }
                        >
                          <a
                            href={`#${item.id}`}
                            className="text-white/80 hover:text-white transition-colors"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </CardContent>
            </Card>
            {false && (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 mt-8">
                <CardHeader>
                  <CardTitle className="text-white">
                    Posts Relacionados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {relatedPosts.map((relatedPost) => (
                      <div key={relatedPost.id} className="group">
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                          {/* Image Container */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                              <div className="flex flex-wrap gap-1">
                                {relatedPost.categories?.map((cat, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30"
                                  >
                                    {cat.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                              {relatedPost.title}
                            </h3>

                            <p className="text-white/70 text-xs mb-3 line-clamp-2 leading-relaxed">
                              {relatedPost.description}
                            </p>

                            {/* Action Button */}
                            <a
                              href={`/blog/post/${relatedPost.slug}`}
                              className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-purple-500/25 text-center block text-xs"
                            >
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
          </aside>
        </div>
      </div>
    </>
  );
}
