"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShinyText from "@/components/ShinyText";
import { Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import RichTextEditor from "@/components/RichTextEditor";
import { MultiSelect } from "@/components/ui/multiselect";


type FormData = {
    title: string;
    content: string;
    categories: string[];
};

export default function CreateEditPostPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string[];
    const isNew = id[0] === "new";
    const postId = isNew ? null : id[0];

    const [image, setImage] = useState<File | null>(null);
    const [categories, setCategories] = useState<
        { id: number; name: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load categories
                const categoriesResponse = await fetch('/api/categories');
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData.categories || categoriesData);

                // If editing, load post data
                if (!isNew && postId) {
                    const postResponse = await fetch(`/api/posts/id/${postId}`);
                    if (!postResponse.ok) {
                        if (postResponse.status === 404) {
                            router.replace('/not-found');
                            return;
                        }
                        throw new Error('Failed to fetch post');
                    }
                    const postData = await postResponse.json();
                    if (!postData.post) {
                        router.replace('/not-found');
                        return;
                    }
                    setValue("title", postData.post.title);
                    setValue("content", postData.post.content);
                    setValue("categories", postData.post.categories || []);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isNew, postId, setValue]);

    const onSubmit = async (data: FormData) => {
        setSubmitting(true);
        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? '/api/posts' : `/api/posts/id/${postId}`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save post');
            }

            const result = await response.json();

            alert(
                isNew
                    ? "Post creado exitosamente!"
                    : "Post actualizado exitosamente!"
            );

            router.push('/blog/listposts');
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Error al guardar el post");
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
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
            {/* Contenido */}
            <div className="relative max-w-5xl z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0 mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <ShinyText
                        text={isNew ? "Crear Nuevo Post" : "Editar Post"}
                        className="text-4xl font-bold text-white mb-4"
                    />
                    <p className="text-lg text-white/80">
                        {isNew
                            ? "Crea un nuevo artículo para el blog"
                            : "Modifica los detalles del artículo"}
                    </p>
                </div>

                {/* Form */}
                <Card className="bg-black/20 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="text-white text-2xl">
                            Detalles del Post
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-white mb-2">
                                    Título
                                </label>
                                <Input
                                    type="text"
                                    {...register("title", {
                                        required: "El título es requerido",
                                    })}
                                    placeholder="Ingresa el título del post"
                                />
                                {errors.title && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Categorías
                                </label>
                                <MultiSelect
                                    options={categories.map((cat) => ({
                                        value: cat.name,
                                        label: cat.name,
                                    }))}
                                    defaultValues={watch("categories") || []}
                                    onChange={(selected) =>
                                        setValue("categories", selected, {
                                            shouldValidate: true,
                                        })
                                    }
                                    placeholder="Selecciona categorías"
                                />
                                {errors.categories && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.categories.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Contenido (Rich Text)
                                </label>
                                <RichTextEditor
                                    value={watch("content") || ""}
                                    onChange={(value) =>
                                        setValue("content", value, {
                                            shouldValidate: true,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Imagen
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white hover:file:bg-white/30"
                                />
                                {image && (
                                    <p className="text-white/60 text-sm mt-1">
                                        Nueva imagen seleccionada: {image.name}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {submitting
                                        ? "Guardando..."
                                        : isNew
                                        ? "Crear Post"
                                        : "Actualizar Post"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-white hover:bg-white/10"
                                    onClick={() => router.push('/blog/listposts')}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
