<script lang="ts">
    import { getContext } from "svelte";
    import { deleteTrack, type Track } from "../../lib/api/track";
    import TrackEntity from "./TrackEntity.svelte";

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");

    let { data } = $props<{
        data: Track[];
    }>();

    let selected = $state({} as Track);
    let menuX = $state(0);
    let menuY = $state(0);
    let menuVisible = $state(false);
</script>

<svelte:window onclick={() => (menuVisible = false)} />

<div class="tracklist">
    <!-- Column headers -->
    <div class="tracklist__header">
        <span class="tracklist__col tracklist__col--title">TITLE</span>
        <span class="tracklist__col tracklist__col--artist">ARTIST</span>
        <span class="tracklist__col tracklist__col--album">ALBUM</span>
        <span class="tracklist__col tracklist__col--genre">GENRE</span>
        <span class="tracklist__col tracklist__col--year">YEAR</span>
        <span class="tracklist__col tracklist__col--duration">DURATION</span>
    </div>

    <!-- Track rows -->
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
    <ul class="menu" style="top: {menuY}px; left: {menuX}px;">
        <li>
            <button
                onclick={async () => {
                    menuVisible = false;
                    tracks.cache = { ...tracks.cache, [selected.id]: selected };
                }}>Add to queue</button>
        </li>
        <li>
            <button
                onclick={async () => {
                    menuVisible = false;
                    const response = await deleteTrack(selected.id);
                    if (response.ok) {
                        console.log(`Track with id ${selected.id} deleted`);
                    }
                }}>Delete</button>
        </li>
    </ul>
{/if}

<style>
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&display=swap');

    .tracklist {
        font-family: 'IBM Plex Mono', monospace;
        width: 100%;
    }

    /* Header row */
    .tracklist__header {
        display: grid;
        grid-template-columns: 2fr 1.5fr 1.5fr 1fr 0.5fr 0.5fr;
        padding: 0 0.75rem;
        margin-bottom: 0.25rem;
        border-bottom: 1px solid #2a2a2a;
        padding-bottom: 0.4rem;
    }

    .tracklist__col {
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        color: #444;
    }

    .tracklist__col--duration,
    .tracklist__col--year {
        text-align: right;
    }

    /* Context menu */
    .menu {
        position: fixed;
        margin: 0;
        padding: 3px 0;
        list-style: none;
        background: #0f0f0f;
        border: 1px solid #2a2a2a;
        border-radius: 2px;
        min-width: 160px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
        z-index: 1000;
    }

    .menu li {
        display: block;
    }

    .menu button {
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.65rem;
        font-weight: 400;
        letter-spacing: 0.08em;
        color: #888;
        background: none;
        border: none;
        padding: 0.45rem 0.75rem;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: color 0.15s, background 0.15s;
    }

    .menu button:hover {
        color: #e8e8e8;
        background: #1a1a1a;
    }
</style>