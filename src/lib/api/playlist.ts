import { api, type Result } from "./common";
import { type Track } from "./track";

export interface PlaylistEntry {
    id: string;
    trackId: string;
}

export interface Playlist {
    name: string;
    id: string;
    entries: PlaylistEntry[]
}

export interface CreatePlaylistRequest {
    name: string;
}

const BASE = 'playlist';

export async function getPlaylists() : Promise<Result<Playlist[]>> {
    const path = BASE;

    const response = await api<Playlist[]>(path, {
        method: 'GET'
    });

    return response;
}

export async function getPlaylistTracks(id: string) : Promise<Result<Track[]>> {
    const path = `${BASE}/${id}/tracks`;

    const response = await api<Track[]>(path, {
        method: 'GET'
    });

    return response;
}

export async function createPlaylist(name: string) : Promise<Result<Playlist>> {
    const path = BASE;

    const response = await api<Playlist>(path, {
        method: 'POST',
        body: JSON.stringify({name})
    });

    return response;
}

export async function getIcon(id: string) : Promise<Result<Blob>> {
    const path = `${BASE}/${id}/icon`;

    const response = await api<Blob>(path, {
        method: 'GET',
        headers: {'Accept': 'image/jpeg'}
    }, {as: 'blob', allReturn: true});

    return response;
}

export async function addTrack(playlistId: string, trackId: string) : Promise<Result<Playlist>> {
    const path = `${BASE}/${playlistId}/track`;

    const response = await api<Playlist>(path, {
        method: 'POST',
        body: JSON.stringify({trackId})
    });

    return response;
}

export async function removeTrack(playlistId: string, entryId: string) : Promise<Result<Playlist>> {
    const path = `${BASE}/${playlistId}/track/${entryId}`;

    const response = await api<Playlist>(path, {
        method: 'DELETE'
    }, {as: 'none'});

    return response;
}