"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";
import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/Skeleton";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  date: string;
  author: string;
  image: string;
  category: string;
}


export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(1); // API uses category ID
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Separate state for filter inputs
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempCategory, setTempCategory] = useState(1);

  // API data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    const data = await response.json();
    setCategories(data.categories);
  };

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch posts with filters
  const fetchPosts = async (search: string, categoryId: number, page: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        categoryId: categoryId.toString(),
        page: page.toString(),
        limit: postsPerPage.toString(),
      });
      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
      setTotalPages(0);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts("", 1, 1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(searchTerm, selectedCategory, page);
  };

  const handlePageClick = (page: number, e: React.MouseEvent) => {
    e.preventDefault();
    handlePageChange(page);
  };

  const applyFilters = () => {
    setSearchTerm(tempSearchTerm);
    setSelectedCategory(tempCategory);
    setCurrentPage(1);
    fetchPosts(tempSearchTerm, tempCategory, 1);
  };

  const clearFilters = () => {
    setTempSearchTerm("");
    setTempCategory(1);
    setSearchTerm("");
    setSelectedCategory(1);
    setCurrentPage(1);
    fetchPosts("", 1, 1);
  };

  return (
    <>

      {/* Contenido principal */}
      <div className="relative max-w-5xl mx-auto z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <ShinyText text="Blog de Dev Talles" className="text-4xl font-bold text-white mb-4" />
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Descubre artículos, tutoriales y experiencias compartidas por la comunidad de desarrolladores.
            </p>
          </div>


          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main content - Left side */}
            <div className="lg:col-span-3">
              {/* Header with subtitle and count */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Todos los Artículos</h2>
                <p className="text-white/60">
                  {totalPosts} artículo{totalPosts !== 1 ? 's' : ''} encontrado{totalPosts !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Grid de posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {loading ? (
                  // Skeleton loading state
                  Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="group">
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Image Container Skeleton */}
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Skeleton className="w-full h-full" />
                        </div>
                        {/* Content Skeleton */}
                        <div className="p-6 space-y-4">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Skeleton className="w-6 h-6 rounded-full" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-3 w-12" />
                          </div>
                          <Skeleton className="h-10 w-full rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                    posts.map((post) => (
                      <div key={post.id} className="group">
                        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                          {/* Image Container */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-purple-200 transition-colors duration-300">
                              {post.title}
                            </h3>

                            <p className="text-white/70 text-sm mb-4 line-clamp-3 leading-relaxed">
                              {post.description}
                            </p>

                            {/* Meta Information */}
                            <div className="flex items-center justify-between text-xs text-white/50 mb-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {post.author.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span>{post.author}</span>
                              </div>
                              <span>{new Date(post.date).toLocaleDateString()}</span>
                            </div>

                            {/* Action Button */}
                            <Link href={`/blog/post/${post.slug}`}>
                              <button className="cursor-pointer w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group-hover:shadow-purple-500/25">
                                <span className="flex items-center justify-center space-x-2">
                                  <span>Leer más</span>
                                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                  </svg>
                                </span>
                              </button>
                            </Link>
                          </div>

                          {/* Decorative Elements */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-bl-full" />
                          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />
                        </div>
                      </div>
                    ))
                  )
                }
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={(e) => handlePageClick(currentPage - 1, e)}
                    disabled={currentPage === 1}
                    className="text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "ghost"}
                        onClick={(e) => handlePageClick(page, e)}
                        className={currentPage === page ? "bg-white/20 text-white" : "text-white/60 hover:bg-white/10"}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    onClick={(e) => handlePageClick(currentPage + 1, e)}
                    disabled={currentPage === totalPages}
                    className="text-white hover:bg-white/10"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Aside - Right side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Buscar y Filtrar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Buscar artículos..."
                        value={tempSearchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-white mb-2">Categoría</label>
                      <select
                        value={tempCategory}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTempCategory(parseInt(e.target.value))}
                        className="w-full h-10 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id} className="bg-black text-white">
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={applyFilters}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        Filtrar
                      </Button>
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="flex-1 text-white border-white/20 hover:bg-white/10"
                      >
                        Limpiar
                      </Button>
                    </div>

                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
