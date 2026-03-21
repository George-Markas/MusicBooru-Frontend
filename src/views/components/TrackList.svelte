<script lang="ts">
    import { getContext, onMount } from "svelte";
    import { deleteTrack, type Track } from "../../lib/api/track";
    import TrackEntity from "./TrackEntity.svelte";
    import "../../assets/styles/track-list.css";
    import { addTrack, getPlaylists, removeTrack, type Playlist, type PlaylistEntry } from "../../lib/api/playlist";
    import type { SessionData } from "../../lib/api/auth";

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");
    const session = getContext<SessionData>("session");

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                node.remove();
            },
        };
    }

    let { data, playlist = null, onRemove } = $props<{
        data: Track[];
        playlist?: Playlist;
        onRemove?: (id: string) => void;
    }>();

    let localData = $state({ list: [...data] });

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

<div class="tracklist">
    <div class="tracklist__header">
        <span class="tracklist__col tracklist__col--title">TITLE</span>
        <span class="tracklist__col tracklist__col--artist">ARTIST</span>
        <span class="tracklist__col tracklist__col--album">ALBUM</span>
        <span class="tracklist__col tracklist__col--genre">GENRE</span>
        <span class="tracklist__col tracklist__col--year">YEAR</span>
        <span class="tracklist__col tracklist__col--duration">DURATION</span>
    </div>

    <div class="tracklist__body">
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
    </div>
</div>

{#if menuVisible}
    <ul class="menu" use:portal style="top: {menuY}px; left: {menuX}px;">
        <button
            onclick={async () => {
                menuVisible = false;
                tracks.cache = { ...tracks.cache, [selected.id]: selected };
            }}>Add to queue</button
        >

        {#each playlists.data as playlist (playlist) }            
            <button onclick={async () => {
                const response = await addTrack(playlist.id, selected.id);
                if (response.ok) {
                    console.log(`Track with id ${selected.id} added to playlist ${playlist.name}/${playlist.id}`);
                }
            }}>Add to '{playlist.name}'</button>
        {/each}
        
        {#if playlist===null && session.role === 'ADMIN'}      
            <button onclick={async () => { 
                menuVisible = false;
                const response = await deleteTrack(selected.id);
                if (response.ok) {
                    localData.list = localData.list.filter(t => t.id !== selected.id);
                    onRemove();
                    console.log(`Track with id ${selected.id} deleted`);
                }
                console.log(response.status);
            }}>Delete from Collection</button>

        {:else if playlist}
            <button onclick={async () => { 
                menuVisible = false;
                const entryId = getEntryId(selected.id);
                const response = await removeTrack(playlist.id, entryId ?? '');

                if (response.ok) {
                    localData.list = localData.list.filter(t => t.id !== selected.id);
                    onRemove?.(selected.id);
                    console.log(`Track with id ${entryId} deleted from playlist ${playlist.id}`);
                }
                console.log(response.status);
            }}>Remove from playlist</button>
        {/if}
    </ul>
{/if}

        

        