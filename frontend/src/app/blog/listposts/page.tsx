'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
import { useState, useEffect } from 'react';
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Plus,
    Eye,
    Edit,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

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

export default function ListPostsPage() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        null
    );
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10; // Fixed value

    // Separate state for filter inputs
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [tempCategory, setTempCategory] = useState<number | null>(null);

    // State for fetched data
    const [posts, setPosts] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPosts, setTotalPosts] = useState(10);
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);

    const fetchPosts = async (
        title: string,
        categoryId: number | null,
        page: number
    ) => {
        const params = new URLSearchParams({
            title,
            ...(categoryId !== null && { categoryId: categoryId.toString() }),
            page: page.toString(),
            limit: postsPerPage.toString(),
        });
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}post?${params.toString()}`
        );
        const data = await response.json();
        setPosts(data.data);
        setTotalPages(data.meta.totalPages);
        setTotalPosts(data.meta.total);
    };

    const fetchCategories = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}category`,
            {
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
            }
        );

        const data = await response.json();
        setCategories(data);
    };

    useEffect(() => {
        fetchCategories();

        fetchPosts('', null, 1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

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
        setTempSearchTerm('');
        setTempCategory(null);
        setSearchTerm('');
        setSelectedCategory(null);
        setCurrentPage(1);
        fetchPosts('', null, 1);
    };

    return (
        <>
            {/* Contenido principal */}
            <div className="relative mx-auto max-w-5xl z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <ShinyText
                            text="Lista de Posts"
                            className="text-4xl font-bold text-white mb-4"
                        />
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                            Gestiona todos los artículos del blog con filtros y
                            paginación.
                        </p>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main content - Left side */}
                        <div className="lg:col-span-3">
                            {/* Header with subtitle and count */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Todos los Artículos
                                </h2>
                                <p className="text-white/60">
                                    {totalPosts} artículo
                                    {totalPosts !== 1 ? 's' : ''} encontrado
                                    {totalPosts !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/* Table de posts */}
                            <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden mb-12">
                                <table className="w-full">
                                    <thead className="bg-white/5">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                                Título
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                                Categoría
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                                Autor
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {posts ? (
                                            posts.map(post => (
                                                <tr
                                                    key={post.id}
                                                    className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-12 w-12">
                                                                {post.image && (
                                                                    <Image
                                                                        className="h-12 w-12 rounded-lg object-cover"
                                                                        src={
                                                                            post.image
                                                                        }
                                                                        alt={
                                                                            post.title
                                                                        }
                                                                        width={
                                                                            48
                                                                        }
                                                                        height={
                                                                            48
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-white">
                                                                    {post.title}
                                                                </div>
                                                                <div className="text-sm text-white/60 line-clamp-1">
                                                                    {
                                                                        post.description
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {post.categories?.map(
                                                                (
                                                                    cat,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="px-2 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                                                                        {
                                                                            cat.name
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white/70">
                                                        {new Date(
                                                            post.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-white/70">
                                                        <div className="flex items-center">
                                                            <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2">
                                                                <span className="text-white text-xs font-bold">
                                                                    {post.user.username
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>
                                                            {post.user.username}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-white/70 hover:text-white hover:bg-white/10">
                                                                <Link
                                                                    href={`/blog/post/${post.slug}`}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-white/70 hover:text-white hover:bg-white/10">
                                                                <Link
                                                                    href={`/blog/createpost/${post.id}`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-6 py-4 text-center text-sm text-white/70">
                                                    No se encontraron artículos.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        onClick={e =>
                                            handlePageClick(currentPage - 1, e)
                                        }
                                        disabled={currentPage === 1}
                                        className="text-white hover:bg-white/10">
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>

                                    <div className="flex gap-2">
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map(page => (
                                            <Button
                                                key={page}
                                                variant={
                                                    currentPage === page
                                                        ? 'default'
                                                        : 'ghost'
                                                }
                                                onClick={e =>
                                                    handlePageClick(page, e)
                                                }
                                                className={
                                                    currentPage === page
                                                        ? 'bg-white/20 text-white'
                                                        : 'text-white/60 hover:bg-white/10'
                                                }>
                                                {page}
                                            </Button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="ghost"
                                        onClick={e =>
                                            handlePageClick(currentPage + 1, e)
                                        }
                                        disabled={currentPage === totalPages}
                                        className="text-white hover:bg-white/10">
                                        Siguiente
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Aside - Right side */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <div className="mb-6">
                                    <Button
                                        asChild
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                        <Link
                                            href="/blog/createpost/new"
                                            className="flex items-center justify-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            Crear Nuevo Post
                                        </Link>
                                    </Button>
                                </div>
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
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) =>
                                                    setTempSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                        </div>

                                        {/* Category Filter */}
                                        <div>
                                            <label className="block text-white mb-2">
                                                Categoría
                                            </label>
                                            <select
                                                value={tempCategory ?? ''}
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLSelectElement>
                                                ) =>
                                                    setTempCategory(
                                                        e.target.value === ''
                                                            ? null
                                                            : parseInt(
                                                                  e.target.value
                                                              )
                                                    )
                                                }
                                                className="w-full h-10 rounded-md border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20">
                                                <option
                                                    value=""
                                                    className="bg-black text-white">
                                                    Todas las categorías
                                                </option>
                                                {categories.map(category => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                        className="bg-black text-white">
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Filter Buttons */}
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={applyFilters}
                                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                                Filtrar
                                            </Button>
                                            <Button
                                                onClick={clearFilters}
                                                variant="outline"
                                                className="flex-1 text-white border-white/20 hover:bg-white/10">
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
