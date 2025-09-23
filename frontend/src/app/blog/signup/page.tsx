'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShinyText from '@/components/ShinyText';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const signupSchema = z.object({
    email: z.string().email('Dirección de correo electrónico inválida'),
    username: z.string().min(1, 'El nombre de usuario es obligatorio'),
    firstName: z.string().min(1, 'El nombre es obligatorio'),
    lastName: z.string().min(1, 'Los apellidos son obligatorios'),
    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }

            router.push('/blog/login');
        } catch {
            toast.error('Error al crear la cuenta');
        } finally {
            toast.success('Cuenta creada correctamente');
        }
    };

    return (
        <>
            {/* Contenido */}
            <div className="relative z-10 min-h-screen flex items-center justify-center pt-40 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-md w-full">
                    <div className="text-center mb-8">
                        <ShinyText
                            text="Crear Cuenta"
                            className="text-4xl font-bold text-white mb-4"
                        />
                        <p className="text-lg text-white/80">
                            Regístrate para acceder al blog
                        </p>
                    </div>

                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-8">
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4 mb-6">
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    {...register('email')}
                                />
                                {errors.email?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Nombre"
                                    {...register('firstName')}
                                />
                                {errors.firstName?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Apellidos"
                                    {...register('lastName')}
                                />
                                {errors.lastName?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Nombre de usuario"
                                    {...register('username')}
                                />
                                {errors.username?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.username.message}
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    {...register('password')}
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }>
                                    {showPassword ? (
                                        <EyeOff size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </Button>
                                {errors.password?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>
                            <Button type="submit" className="w-full">
                                Crear Cuenta
                            </Button>
                        </form>

                        <div className="text-center mt-6">
                            <p className="text-white/60 mb-2">
                                ¿Ya tienes cuenta?
                            </p>
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/10"
                                asChild>
                                <a href="/blog/login">Iniciar Sesión</a>
                            </Button>
                        </div>

                        <div className="text-center mt-4">
                            <Button
                                variant="ghost"
                                className="text-white hover:bg-white/10"
                                asChild>
                                <a
                                    href="/blog"
                                    className="flex items-center gap-2">
                                    <ArrowLeft size={16} />
                                    Volver al blog
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
