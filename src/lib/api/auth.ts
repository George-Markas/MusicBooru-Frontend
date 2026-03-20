
import { type Result, api} from "./common";

interface AuthRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role: 'ADMIN' | 'USER';
}

export interface SessionData {
    username: string;
    role: string;
}

const METHOD = 'POST';

export async function authenticate(credentials: AuthRequest) : Promise<Result<string>> {
    const path = 'auth/authenticate';
    const response = await api<string>(path, {
            method: METHOD, 
            body: JSON.stringify(credentials)
        });

    return response;
}

export async function register(credentials: RegisterRequest) : Promise<Result<string>> {
    const path = 'auth/register';

    const response = await api<string>(path, {
        method: METHOD,
        body: JSON.stringify(credentials)
    });

    return response;
}

export async function logout() : Promise<Result<string>> {
    const path = 'auth/logout';
    const response = await api<string>(path, {
        method: METHOD
    });

    return response;
}

export async function getSession() : Promise<Result<SessionData>> {
    const path = 'auth';
    const response = await api<SessionData>(path, {
            method: 'GET'
        });

    return response;
}