"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShinyText from "@/components/ShinyText";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthenticatedRequest } from "@/contexts/AuthContext";

interface Category {
  id: number;
  name: string;
}

export default function ListCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { authenticatedFetch } = useAuthenticatedRequest();

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      // Filter out the "All" category for management
      setCategories(data.categories?.filter((cat: Category) => cat.id !== 0) || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta categoría?"))
      return;

    try {
      const response = await authenticatedFetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete category");
      }
      setCategories(categories.filter((cat) => cat.id !== id));
      alert("Categoría eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Error al eliminar la categoría");
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
    <ProtectedRoute>
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
                  {categories.length !== 1 ? "s" : ""} encontrada
                  {categories.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Button
                asChild
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Link
                  href="/blog/createcategory/new"
                  className="flex items-center gap-2"
                >
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
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-white/5 transition-colors"
                    >
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
                            className="text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <Link href={`/blog/createcategory/${category.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDelete(category.id)}
                          >
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
    </ProtectedRoute>
  );
}
