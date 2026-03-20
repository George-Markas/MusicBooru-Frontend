import { api, type Result } from "./common";

export type Track = {
    id: string,
    title: string,
    artist: string,
    album: string,
    genre: string, 
    year: string,
    filename: string
}

export async function getTracks(): Promise<Result<Track[]>> {
    const path = `track`;

    const response = await api<Track[]>(path, {
        method: 'GET'
    });

    return response;
}

export async function searchTracks(query: string): Promise<Result<Track[]>> {
    const path = `track/search`;

    const response = await api<Track[]>(path, {
        method: 'GET'
    }, {params: query});

    return response;
}

export async function sortTracks(sortOption: string): Promise<Result<Track[]>> {
    const path = `track/sort/${sortOption}`;

    const response = await api<Track[]>(path, {
        method: 'GET'
    });

    return response;
}

export async function getTrack(id: string): Promise<Result<Track>> {
    const path = `track/${id}`;

    const response = await api<Track>(path, {
        method: 'GET'
    });

    return response;
}

export async function getTrackArt(id: string): Promise<Result<Blob>> {
    const path = `track/${id}/art`;

    const response = await api<Blob>(path, {
        method: 'GET',
        headers: {'Accept': 'image/jpeg'}
    }, {params: '', as: 'blob'});

    return response;
}

export async function streamTrack(id: string): Promise<Result<Blob>> {
    const path = `stream/${id}`;

    const response = await api<Blob>(path, {
        method: 'GET',
    }, {as: 'blob'});

    return response;
}

export async function uploadTrack(form: FormData): Promise<Result<string>> {
    const path = `track/batch`;

    const response = await api<string>(path, {
        method: 'POST',
        body: form,
    });

    return response;
}

export async function deleteTrack(id: string) : Promise<Result<undefined>> {
    const path = `track/${id}`;

    const response = await api<undefined>(path, {
        method: 'DELETE',
    }, {as: 'none'});

    return response;
}