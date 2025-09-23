'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShinyText from '@/components/ShinyText';
import { Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type FormData = {
    name: string;
};

export default function CreateEditCategoryPage() {
    const { data: session } = useSession();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string[];
    const isNew = slug[0] === 'new';
    const categoryId = isNew ? null : slug[0];

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>();

    useEffect(() => {
        const loadData = async () => {
            try {
                // If editing, load category data
                if (!isNew && categoryId) {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}category/${categoryId}`
                    );

                    if (!response.ok) {
                        if (response.status === 404) {
                            router.replace('/not-found');
                            return;
                        }
                        throw new Error('Failed to fetch category');
                    }
                    const data = await response.json();
                    setValue('name', data.name);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isNew, categoryId, setValue, router]);

    const onSubmit = async (data: FormData) => {
        setSubmitting(true);
        try {
            const method = isNew ? 'POST' : 'PATCH';
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL}category`
                : `${process.env.NEXT_PUBLIC_API_URL}category/${categoryId}`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user?.access_token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to save category');
            }

            toast.success(
                isNew
                    ? 'Categoría creada exitosamente!'
                    : 'Categoría actualizada exitosamente!'
            );

            router.push('/blog/listcategories');
        } catch {
            toast.error('Error al guardar la categoría');
        } finally {
            setSubmitting(false);
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
            <div className="relative max-w-5xl z-10 min-h-screen pt-40 px-4 py-16 sm:px-6 lg:px-0 mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <ShinyText
                        text={
                            isNew ? 'Crear Nueva Categoría' : 'Editar Categoría'
                        }
                        className="text-4xl font-bold text-white mb-4"
                    />
                    <p className="text-lg text-white/80">
                        {isNew
                            ? 'Crea una nueva categoría para el blog'
                            : 'Modifica los detalles de la categoría'}
                    </p>
                </div>

                {/* Form */}
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle className="text-white text-2xl">
                            Detalles de la Categoría
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6">
                            <div>
                                <label className="block text-white mb-2">
                                    Nombre
                                </label>
                                <Input
                                    type="text"
                                    {...register('name', {
                                        required: 'El nombre es requerido',
                                    })}
                                    placeholder="Ingresa el nombre de la categoría"
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {errors.name.message}
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
                                          ? 'Crear Categoría'
                                          : 'Actualizar Categoría'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="text-white hover:bg-white/10"
                                    onClick={() =>
                                        router.push('/blog/listcategories')
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
