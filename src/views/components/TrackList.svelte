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

        <button
            onclick={async () => {
                menuVisible = false;

                const response = await deleteTrack(selected.id);
                if (response.ok) {
                    console.log(`Track with id ${selected} deleted`);
                }
                console.log(response.status);
            }}>Action</button
        >
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
