import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            access_token: string;
            user: {
                id: number;
                username: string;
                email: string;
                firstName: string;
                lastName: string;
                role: string;
            };
        } & DefaultSession['user'];
    }
}
