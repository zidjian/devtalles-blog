"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Tag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/Skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useAuth, useAuthenticatedRequest } from "@/contexts/AuthContext";

interface Post {
  id: number;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    profilePicture: string | null;
  };
  image: string;
  categories: {
    id: number;
    name: string;
  }[];
}

export default function BlogPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { authenticatedFetch } = useAuthenticatedRequest();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 = All categories
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Separate state for filter inputs
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempCategory, setTempCategory] = useState(0);

  // API data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data.categories);
  };

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch posts with filters
  const fetchPosts = async (
    search: string,
    categoryId: number,
    page: number
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: postsPerPage.toString(),
      });

      // Only add categoryId if it's not 0 (All)
      if (categoryId !== 0) {
        params.append("categoryId", categoryId.toString());
      }

      // Add search term if provided
      if (search.trim()) {
        params.append("title", search.trim());
      }

      const response = await fetch(
        `http://localhost:3000/api/post?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      console.log(data);
      setPosts(data.data);
      setTotalPages(data.totalPages);
      setTotalPosts(data.totalPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
      setTotalPages(0);
      setTotalPosts(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts("", 0, 1);
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
    setTempCategory(0);
    setSearchTerm("");
    setSelectedCategory(0);
    setCurrentPage(1);
    fetchPosts("", 0, 1);
  };

  return (
    <>
      {/* Contenido principal */}
      <div className="relative max-w-6xl mx-auto z-10 min-h-screen pt-32 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero Section - Más minimalista */}
          <div className="text-center mb-16">
            {/* Badge similar a la landing */}
            <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-sm text-white/80">
              <span className="mr-2">📚</span>
              Blog de la comunidad
              {!authLoading && (
                <>
                  <span className="mx-2">•</span>
                  {isAuthenticated ? (
                    <span className="text-green-400">
                      👋 ¡Hola, {user?.username || user?.email}!
                    </span>
                  ) : (
                    <span className="text-white/60">Visitante</span>
                  )}
                </>
              )}
            </div>

            <h1 className="text-5xl font-bold text-white sm:text-6xl mb-6">
              Explora, aprende y{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                comparte
              </span>
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              Descubre artículos y experiencias de la comunidad de Dev Talles
            </p>
          </div>

          {/* Sección de Filtros Horizontal */}
          <div className="mb-16">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <h3 className="text-lg font-medium text-white">
                  Filtros y Búsqueda
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 mb-2">
                    Buscar artículos
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      value={tempSearchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setTempSearchTerm(e.target.value)
                      }
                      className="pl-12 bg-white/5 border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:bg-white/10 focus:border-white/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 mb-2">
                    Categoría
                  </label>
                  <Select
                    value={tempCategory.toString()}
                    onValueChange={(value: string) =>
                      setTempCategory(parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Categorías</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter Buttons */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70 mb-2">
                    Acciones
                  </label>
                  <div className="flex gap-3">
                    <Button
                      onClick={applyFilters}
                      className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white border border-white/10 rounded-2xl transition-all duration-300"
                    >
                      Aplicar
                    </Button>
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      className="px-4 text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                    >
                      Limpiar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats minimalistas */}
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              <span className="text-sm">
                {totalPosts} artículo{totalPosts !== 1 ? "s" : ""} disponible
                {totalPosts !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <span>Categorías:</span>
                <span className="text-white font-medium">
                  {categories.length}
                </span>
              </div>
            </div>
          </div>

          {/* Grid más espacioso y elegante */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {loading ? (
              // Skeleton loading state - Más elegante
              Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="group">
                  <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-500">
                    {/* Image Container Skeleton */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Skeleton className="w-full h-full" />
                    </div>
                    {/* Content Skeleton */}
                    <div className="p-8 space-y-4">
                      <Skeleton className="h-7 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center gap-2">
                          <Skeleton className="w-8 h-8 rounded-full" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : posts.length === 0 ? (
              // Estado vacío - Mensaje de feedback elegante
              <div className="col-span-full flex flex-col items-center justify-center py-24">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-12 text-center max-w-md mx-auto">
                  {/* Icono decorativo */}
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Search className="w-8 h-8 text-white/60" />
                  </div>

                  {/* Título */}
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    No se encontraron artículos
                  </h3>

                  {/* Descripción */}
                  <p className="text-white/60 mb-8 leading-relaxed">
                    {searchTerm || selectedCategory !== 0
                      ? "No hay artículos que coincidan con los filtros aplicados. Intenta ajustar tu búsqueda o cambiar la categoría."
                      : "Aún no hay artículos publicados en el blog. ¡Vuelve pronto para ver nuevo contenido!"}
                  </p>

                  {/* Botón de acción */}
                  {(searchTerm || selectedCategory !== 0) && (
                    <Button
                      onClick={clearFilters}
                      className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-white border border-white/10 rounded-2xl transition-all duration-300 px-6 py-3"
                    >
                      Limpiar filtros
                    </Button>
                  )}

                  {/* Decoración sutil */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full" />
                </div>
              </div>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/post/${post.slug}`}
                  className="group block"
                >
                  <article className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-1">
                    {/* Image Container - Más elegante */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={500}
                        height={312}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Overlay sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                      {/* Category badge */}
                      {post.categories.length > 0 && (
                        <div className="absolute top-4 left-4">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                            <Tag className="w-3 h-3" />
                            {post.categories[0].name}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content - Más espacioso y limpio */}
                    <div className="p-8">
                      <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 leading-tight group-hover:text-purple-200 transition-colors duration-300">
                        {post.title}
                      </h3>

                      <p className="text-white/60 text-sm mb-6 line-clamp-2 leading-relaxed">
                        {post.description || "Sin descripción disponible"}
                      </p>

                      {/* Meta Information - Más elegante */}
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-400/20 to-pink-400/20 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <User className="w-4 h-4 text-white/70" />
                          </div>
                          <span className="font-medium">
                            {post.user.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Read more indicator - Más sutil */}
                      <div className="mt-6 flex items-center gap-2 text-sm text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
                        <span>Leer artículo</span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>

                    {/* Decoración sutil */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full" />
                  </article>
                </Link>
              ))
            )}
          </div>

          {/* Paginación más elegante */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3">
              <Button
                variant="ghost"
                onClick={(e) => handlePageClick(currentPage - 1, e)}
                disabled={currentPage === 1}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Anterior
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant="ghost"
                      onClick={(e) => handlePageClick(page, e)}
                      className={
                        currentPage === page
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/20 text-white rounded-full w-10 h-10 p-0"
                          : "text-white/60 hover:text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
                      }
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                onClick={(e) => handlePageClick(currentPage + 1, e)}
                disabled={currentPage === totalPages}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full px-4 py-2 disabled:opacity-30"
              >
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
