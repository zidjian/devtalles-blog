import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { z } from 'zod';
import { convertDuration } from './time';
import { IAuthResponse } from '@/interfaces/iAuthResponse.interface';
import DiscordProvider from 'next-auth/providers/discord';

const duration = convertDuration(process.env.AUTH_DURATION) || 60 * 60 * 8; // 8 hours

export default NextAuth({
    pages: {
        signIn: '/blog/login',
    },
    session: {
        maxAge: duration,
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            if (account?.provider == 'credentials') {
                token.data = {
                    ...user,
                };

                return token;
            } else if (account?.provider == 'discord') {
                const data = {
                    email: user.email || '',
                    discordId: (profile as any)?.id || '',
                    username: user.name || '',
                    access_token: account?.access_token || '',
                    refresh_token: account?.refresh_token || '',
                    avatar: user.image || '',
                };

                const myHeaders = new Headers();
                myHeaders.append('Content-Type', 'application/json');

                const extend = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}auth/register-discord`,
                    {
                        method: 'POST',
                        headers: myHeaders,
                        body: JSON.stringify(data),
                    }
                );
                const extendData = (await extend.json()) as IAuthResponse;

                token.data = {
                    id: +extendData.user.id,
                    email: extendData.user.email,
                    access_token: extendData.access_token,
                    user: {
                        id: +extendData.user.id,
                        username: extendData.user.username,
                        email: extendData.user.email,
                        firstName: extendData.user.firstName,
                        lastName: extendData.user.lastName,
                        role: extendData.user.role,
                    },
                };
            }

            return token;
        },
        async session({ session, token }) {
            session.user = token.data as any;
            return session;
        },
        async redirect({ url, baseUrl }) {
            // Si la URL es relativa, convertirla a absoluta
            if (url.startsWith('/')) {
                const fullUrl = `${baseUrl}${url}`;

                return fullUrl;
            }

            // Si la URL es del mismo dominio, permitirla
            if (new URL(url).origin === baseUrl) {
                return url;
            }

            // Por defecto, redirigir al callback de Discord para procesar la autenticación
            const discordCallback = `${baseUrl}/blog/discord-callback`;

            return discordCallback;
        },
    },
    providers: [
        DiscordProvider({
            clientId:
                process.env.DISCORD_CLIENT_ID ??
                (() => {
                    throw new Error('DISCORD_CLIENT_ID is not set');
                })(),
            clientSecret:
                process.env.DISCORD_CLIENT_SECRET ??
                (() => {
                    throw new Error('DISCORD_CLIENT_SECRET is not set');
                })(),
            authorization:
                'https://discord.com/api/oauth2/authorize?scope=identify+email+guilds+guilds.members.read',
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string(),
                        password: z.string(),
                    })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    return null;
                }

                const { email, password } = parsedCredentials.data;

                // Validar credenciales
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        },
                        body: JSON.stringify({ email, password }),
                    }
                );

                if (response?.ok === false && response.status === 500) {
                    throw new Error('Contacto al administrador del sistema');
                } else if (!response.ok) {
                    const errorBody = await response.json();
                    throw new Error(
                        errorBody.message || 'Error al iniciar sesión'
                    );
                }

                const data = (await response.json()) as IAuthResponse;

                return {
                    id: String(data.user.id),
                    email: data.user.email,
                    ...data,
                };
            },
        }),
    ],
});
