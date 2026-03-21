<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { deleteTrack, type Track } from "../../lib/api/track";
    import TrackEntity from "./TrackEntity.svelte";
    import { addTrack, getPlaylists, removeTrack, type Playlist, type PlaylistEntry } from "../../lib/api/playlist";
    import type { SessionData } from "../../lib/api/auth";

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");
    const session = getContext<SessionData>("session");

    let { data, playlist=null } = $props<{
        data: Track[];
        playlist?: Playlist;
    }>();

    let selected = $state({} as Track);
    let menuX = $state(0);
    let menuY = $state(0);
    let menuVisible = $state(false);

    function getEntryId(trackId: string): string | undefined {
        return playlist?.entries.find((entry: PlaylistEntry) => entry.trackId === trackId)?.id;
    }

    let playlists = $state({ data: [] as Playlist[] });
    async function fetchPlaylistNames() {
        try {
            const response = await getPlaylists();
            if (response.ok) {
                playlists.data = response.data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    onMount(() => { 
        fetchPlaylistNames();
    });
</script>

<svelte:window onclick={() => (menuVisible = false)} />

{#each data as track (track.id)}
    <TrackEntity
        trackData={track}
        oncontextmenu={(e: MouseEvent) => {
            e.preventDefault();
            selected = track;
            menuX = e.clientX;
            menuY = e.clientY;
            menuVisible = true;
        }}
    />
{/each}

{#if menuVisible}
    <ul class="menu" style="top: {menuY}px; left: {menuX}px;">
        <button
            onclick={async () => {
                menuVisible = false;

                tracks.cache = { ...tracks.cache, [selected.id]: selected };
            }}>Add to current queue...</button
        >

        {#each playlists.data as playlist (playlist) }            
            <button onclick={ async () => {
                const response = await addTrack(playlist.id, selected.id);
                if (response.ok) {console.log(`Track with id ${selected.id} added to playlist ${playlist.name}/${playlist.id}`);}
            }}>{playlist.name}</button>
        {/each}
        
        {#if playlist===null && session.role === 'ADMIN'}      
        <button onclick={async () => { 
                menuVisible = false;
                const response = await deleteTrack(selected.id);
                if (response.ok) {
                    console.log(`Track with id ${selected} deleted`);
                }
                console.log(response.status);
            }}>Delete from Collection</button>


        {:else if playlist}
            <button onclick={async () => { 
                menuVisible = false;
                const response = await removeTrack(playlist.id, getEntryId(selected.id) ?? '');
                if (response.ok) {
                    console.log(`Track with id ${getEntryId(selected.id)} deleted from playlist ${playlist.id}`);
                }
                console.log(response.status);
            }}>Remove from Album</button>
        {/if}
        

    </ul>
{/if}

<style>
    .menu {
        position: fixed; /* fixed so clientX/clientY coordinates work directly */
        margin: 0;
        padding: 4px 0;
        list-style: none;
        background: #313244;
        border: 1px solid #45475a;
        border-radius: 6px;
        min-width: 160px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        z-index: 1000;
    }

    .menu button {
        padding: 8px 16px;
        cursor: pointer;
        font-size: 14px;
    }

    .menu button:hover {
        background: #45475a;
    }
</style>
