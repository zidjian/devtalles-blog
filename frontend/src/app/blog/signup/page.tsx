'use client';

import { getProviders, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShinyText from '@/components/ShinyText';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ClientSafeProvider } from 'next-auth/react';

const signupSchema = z.object({
    email: z.string().email('Dirección de correo electrónico inválida'),
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    apellidos: z.string().min(1, 'Los apellidos son obligatorios'),
    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [providers, setProviders] = useState<Record<
        string,
        ClientSafeProvider
    > | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = (data: SignupFormData) => {
        // Handle signup logic here
        console.log(data);
    };

    useEffect(() => {
        const getProvidersData = async () => {
            const providers = await getProviders();
            setProviders(providers);
        };
        getProvidersData();
    }, []);

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
                                    {...register('nombre')}
                                />
                                {errors.nombre?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.nombre.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Input
                                    type="text"
                                    placeholder="Apellidos"
                                    {...register('apellidos')}
                                />
                                {errors.apellidos?.message && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.apellidos.message}
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

                        {providers &&
                            Object.values(providers).map(provider => (
                                <Button
                                    key={provider.name}
                                    onClick={() => signIn(provider.id)}
                                    className="w-full mb-4">
                                    Registrarse con {provider.name}
                                </Button>
                            ))}

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
