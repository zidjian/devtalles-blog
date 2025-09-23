import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { routes } from './lib/routes';
import type { NextRequest } from 'next/server';

// Extrae la primera ruta permitida para el rol del usuario desde routes
function getFirstRouteForRole(userRoles: string[]): string | null {
    for (const item of routes) {
        if (item.rol && userRoles.some(role => item.rol.includes(role))) {
            // Si la ruta contiene :path*, devolver la parte base
            const baseUrl = item.url.replace(/:path\*$/, '');
            return baseUrl;
        }
    }
    return null; // No hay rutas disponibles para este rol
}

// Extrae los roles del token de usuario
function extractRoles(token: any): string[] {
    // Buscar el rol en diferentes ubicaciones posibles del token
    const role = token?.role || token?.data?.user?.role || token?.data?.role;
    
    if (typeof role === 'string') return [role];
    if (Array.isArray(role)) return role;
    
    return [];
}

// Devuelve true si la ruta es de administrador
function isAdminRoute(pathname: string): boolean {
    for (const item of routes) {
        if (item.rol && item.rol.includes('ADMIN')) {
            if (item.url.includes(':path*')) {
                const baseUrl = item.url.replace(/:path\*$/, '');
                if (pathname.startsWith(baseUrl)) {
                    return true;
                }
            } else if (item.url === pathname) {
                return true;
            }
        }
    }
    return false;
}

// Devuelve true si la ruta es pública
function isPublicRoute(pathname: string): boolean {
    for (const item of routes) {
        if (!item.rol) {
            if (item.url.includes(':path*')) {
                const baseUrl = item.url.replace(/:path\*$/, '');
                if (pathname.startsWith(baseUrl)) {
                    return true;
                }
            } else if (item.url === pathname) {
                return true;
            }
        }
    }
    return false;
}
// Devuelve true si el usuario tiene acceso a la ruta solicitada
function isRouteAllowedForRole(pathname: string, userRoles: string[]): boolean {
    for (const item of routes) {
        if (!item.rol) {
            // Public route
            if (item.url.includes(':path*')) {
                const baseUrl = item.url.replace(/:path\*$/, '');
                if (pathname.startsWith(baseUrl)) {
                    return true;
                }
            } else if (item.url === pathname) {
                return true;
            }
        } else if (userRoles.some(role => item.rol.includes(role))) {
            // Soporta rutas dinámicas con :path*
            if (item.url.includes(':path*')) {
                const baseUrl = item.url.replace(/:path\*$/, '');
                if (pathname.startsWith(baseUrl)) {
                    return true;
                }
            } else if (item.url === pathname) {
                return true;
            }
        }
    }
    return false;
}

export async function middleware(request: NextRequest) {
    const token: unknown = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });
    const isAuth = !!token;
    const { pathname } = request.nextUrl;

    if (!isAuth && !isPublicRoute(pathname)) {
        return NextResponse.redirect(new URL('/blog/login', request.url));
    }

    if (isAuth) {
        const roles = extractRoles(token);
        
        // Si el usuario está en páginas de callback de Discord, permitir el acceso
        if (pathname === '/blog/discord-callback' || pathname === '/blog/discord-success') {
            return NextResponse.next();
        }
        
        // Si el usuario tiene rol USER (pero no ADMIN), manejar restricciones
        if (roles.includes('USER') && !roles.includes('ADMIN')) {
            // Si está en login/signup, redirigir al blog
            if (pathname === '/blog/login' || pathname === '/blog/signup') {
                return NextResponse.redirect(new URL('/blog', request.url));
            }
            
            // Si está intentando acceder a rutas de ADMIN, bloquear
            if (isAdminRoute(pathname)) {
                return NextResponse.redirect(new URL('/blog', request.url));
            }
            
            // Permitir acceso a otras rutas
            return NextResponse.next();
        }
        
        // Si el usuario está en login/signup y tiene roles válidos, redirigir
        if (pathname === '/blog/login' || pathname === '/blog/signup') {
            const firstRoute = getFirstRouteForRole(roles);
            
            if (firstRoute === null) {
                // No hay rutas específicas para este rol, redirigir al blog
                return NextResponse.redirect(new URL('/blog', request.url));
            }
            
            return NextResponse.redirect(new URL(firstRoute, request.url));
        }
        
        // Verificación adicional: si es una ruta de ADMIN y el usuario no es ADMIN, bloquear
        if (isAdminRoute(pathname) && !roles.includes('ADMIN')) {
            return NextResponse.redirect(new URL('/blog', request.url));
        }
        
        // Verificar si la ruta actual está permitida para el rol del usuario
        if (!isRouteAllowedForRole(pathname, roles)) {
            const firstRoute = getFirstRouteForRole(roles);
            
            if (firstRoute === null) {
                // No hay rutas específicas para este rol, redirigir al blog
                return NextResponse.redirect(new URL('/blog', request.url));
            }
            
            return NextResponse.redirect(new URL(firstRoute, request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/blog/:path*'],
};
