import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { routes } from './lib/routes';
import type { NextRequest } from 'next/server';

// Extrae la primera ruta permitida para el rol del usuario desde routes
function getFirstRouteForRole(userRoles: string[]): string {
    for (const item of routes) {
        if (item.rol && userRoles.some(role => item.rol.includes(role))) {
            // Si la ruta contiene :path*, devolver la parte base
            const baseUrl = item.url.replace(/:path\*$/, '');
            return baseUrl;
        }
    }
    return '/blog/login';
}

// Extrae los roles del token de usuario
function extractRoles(token: any): string[] {
    const role = token?.role || token?.data?.user?.role;
    if (typeof role === 'string') return [role];
    return [];
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
        if (pathname === '/blog/login' || pathname === '/blog/signup') {
            const firstRoute = getFirstRouteForRole(roles);
            return NextResponse.redirect(new URL(firstRoute, request.url));
        }
        if (!isRouteAllowedForRole(pathname, roles)) {
            return NextResponse.redirect(new URL('/blog', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/blog/:path*'],
};
