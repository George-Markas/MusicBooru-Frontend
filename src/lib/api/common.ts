export const BASE_URL = 'http://localhost:8080/api';

export type SortMode = 'album' | 'title' | 'artist';
export type ViewMode = 'Album' | 'Track'; 
export type AppState = 'login' | 'home' | 'playlists' | 'error' | 'loading';
export type Result<T> = {ok: boolean, status: number, data: T}| {ok: false, status: number, data?: T};
 
export async function api<T>(
    url: string, 
    options: RequestInit = {},
    extras?: { params?: string, as?: 'blob' | 'none', allReturn?: boolean}
) : Promise<Result<T>> {

    const hasExtras = extras?.params !== undefined; 
    const query = hasExtras ? `?query=${encodeURIComponent(extras.params as string)}` : '';

    const response = await fetch(`${BASE_URL}/${url}${query}`, {
            credentials: 'include',
            ...options,
            headers: {
                ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
                ...options.headers
            }
        }
    );

    if (!response.ok) {
        if (extras?.allReturn) {
                const data = extras?.as === 'blob'
                ? await response.blob()
                : extras?.as === 'none'
                ? null
                : await response.json();
            return {ok: false, status: response.status, data};
        }

        return {ok: false, status: response.status};
    }

    const data = extras?.as === 'blob'
    ? await response.blob()
    : extras?.as === 'none'
    ? null
    : await response.json();

    return {ok: true, status: response.status, data};
}