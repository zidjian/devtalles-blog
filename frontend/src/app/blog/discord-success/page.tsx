'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DiscordSuccessPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (status === 'authenticated' && session) {
           
            
            // Redirigir según el rol del usuario
            const userRole = (session.user as any)?.user?.role || (session.user as any)?.role;
            
            if (userRole === 'ADMIN') {
                router.push('/blog/dashboard');
            } else {
                router.push('/blog');
            }
        } else {
            router.push('/blog/login?error=discord_auth_failed');
        }
    }, [status, session, router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-green-500 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-white mb-2">
                    ¡Autenticación exitosa!
                </h2>
                <p className="text-white/70 mb-4">
                    Has iniciado sesión correctamente con Discord.
                </p>
                <div className="animate-pulse text-white/50">
                    Redirigiendo...
                </div>
            </div>
        </div>
    );
}
