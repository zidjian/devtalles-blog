'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShinyText from '@/components/ShinyText';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RichTextEditor from '@/components/RichTextEditor';
import { MultiSelect } from '@/components/ui/multiselect';
import { useSession } from 'next-auth/react';

const schema = z.object({
    title: z.string().min(1, 'El título es requerido'),
    content: z.string().min(1, 'El contenido es requerido'),
    categoryIds: z
        .array(z.string())
        .min(1, 'Selecciona al menos una categoría'),
    image: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateEditPostPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string[];
    const isNew = id[0] === 'new';
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
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load categories
                const categoriesResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}category`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.user?.access_token}`,
                        },
                    }
                );
                if (!categoriesResponse.ok) {
                    throw new Error('Failed to fetch categories');
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData.categories || categoriesData);

                // If editing, load post data
                if (!isNew && postId) {
                    const postResponse = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}post/id/${postId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${session?.user?.access_token}`,
                            },
                        }
                    );
                    if (!postResponse.ok) {
                        if (postResponse.status === 404) {
                            router.replace('/not-found');
                            return;
                        }
                        throw new Error('Failed to fetch post');
                    }
                    const postData = await postResponse.json();

                    setValue('title', postData.title);
                    setValue('content', postData.content);
                    setValue(
                        'categoryIds',
                        postData.categories.reduce(
                            (acc: string[], cat: { id: number }) => {
                                acc.push(String(cat.id));
                                return acc;
                            },
                            []
                        )
                    );
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isNew, postId, setValue]);

    const onSubmit = async (data: FormData) => {
        setSubmitting(true);
        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL}post`
                : `${process.env.NEXT_PUBLIC_API_URL}post/${postId}`;

            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);
            formData.append('categoryIds', JSON.stringify(data.categoryIds));
            if (data.image) {
                formData.append('image', data.image);
            }

            const response = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to save post');
            }

            alert(
                isNew
                    ? 'Post creado exitosamente!'
                    : 'Post actualizado exitosamente!'
            );

            router.push('/blog/listposts');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error al guardar el post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setValue('image', file, { shouldValidate: true });
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
                        text={isNew ? 'Crear Nuevo Post' : 'Editar Post'}
                        className="text-4xl font-bold text-white mb-4"
                    />
                    <p className="text-lg text-white/80">
                        {isNew
                            ? 'Crea un nuevo artículo para el blog'
                            : 'Modifica los detalles del artículo'}
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
                            className="space-y-6">
                            <div>
                                <label className="block text-white mb-2">
                                    Título
                                </label>
                                <Input
                                    type="text"
                                    {...register('title', {
                                        required: 'El título es requerido',
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
                                    options={categories.map(cat => ({
                                        value: String(cat.id),
                                        label: cat.name,
                                    }))}
                                    defaultValues={watch('categoryIds') || []}
                                    onChange={selected =>
                                        setValue('categoryIds', selected, {
                                            shouldValidate: true,
                                        })
                                    }
                                    placeholder="Selecciona categorías"
                                />
                                {errors.categoryIds && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.categoryIds.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-white mb-2">
                                    Contenido (Rich Text)
                                </label>
                                <RichTextEditor
                                    value={watch('content') || ''}
                                    onChange={value =>
                                        setValue('content', value, {
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
                                {errors.image && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    {submitting
                                        ? 'Guardando...'
                                        : isNew
                                          ? 'Crear Post'
                                          : 'Actualizar Post'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-white hover:bg-white/10"
                                    onClick={() =>
                                        router.push('/blog/listposts')
                                    }>
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
