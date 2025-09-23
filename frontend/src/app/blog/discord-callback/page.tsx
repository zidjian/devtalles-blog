'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DiscordCallbackPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            // Aún cargando la sesión
            return;
        }

        if (status === 'authenticated' && session) {
            // Usuario autenticado exitosamente
        
            
            // Redirigir al dashboard o página principal según el rol
            const userRole = (session.user as any)?.user?.role || (session.user as any)?.role;
            
            if (userRole === 'ADMIN') {
                router.push('/blog/dashboard');
            } else {
                router.push('/blog');
            }
        } else {
            // Error en la autenticación
            console.error('Discord callback - Authentication failed');
            router.push('/blog/login?error=discord_auth_failed');
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    Procesando autenticación...
                </h2>
                <p className="text-white/70">
                    Por favor espera mientras completamos tu inicio de sesión con Discord.
                </p>
            </div>
        </div>
    );
}
