import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            access_token: string;
            user: User;
        } & DefaultSession['user'];
    }
}

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
