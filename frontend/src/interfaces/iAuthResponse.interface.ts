export interface IAuthResponse {
    access_token: string;
    user: User;
}

export interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
