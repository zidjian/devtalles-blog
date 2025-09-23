'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ShinyText from '@/components/ShinyText';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function ListCategoriesPage() {
    const { data: session } = useSession();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}category`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.access_token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data.categories || data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session]);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}category/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete category');
            }
            setCategories(categories.filter(cat => cat.id !== id));
            toast.success('Categoría eliminada exitosamente');
        } catch {
            toast.error('Error al eliminar la categoría');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <>
            {/* Contenido principal */}
            <div className="relative mx-auto max-w-5xl z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0">
                <div className="mx-auto max-w-7xl">
                    <div className="text-center mb-12">
                        <ShinyText
                            text="Lista de Categorías"
                            className="text-4xl font-bold text-white mb-4"
                        />
                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                            Gestiona todas las categorías del blog.
                        </p>
                    </div>

                    {/* Header with count */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Todas las Categorías
                                </h2>
                                <p className="text-white/60">
                                    {categories.length} categoría
                                    {categories.length !== 1 ? 's' : ''}{' '}
                                    encontrada
                                    {categories.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <Button
                                asChild
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                                <Link
                                    href="/blog/createcategory/new"
                                    className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Crear Nueva Categoría
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Table de categorías */}
                    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                        <CardContent className="p-0">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {categories.map(category => (
                                        <tr
                                            key={category.id}
                                            className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-white">
                                                    {category.name}
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
                                                            href={`/blog/createcategory/${category.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category.id
                                                            )
                                                        }>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
