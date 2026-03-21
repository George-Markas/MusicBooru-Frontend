<script lang="ts">
    import { getContext } from "svelte";
    import { deleteTrack, type Track } from "../../lib/api/track";
    import TrackEntity from "./TrackEntity.svelte";
    import "../../assets/styles/track-list.css";

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");

    function portal(node: HTMLElement) {
        document.body.appendChild(node);
        return {
            destroy() {
                node.remove();
            },
        };
    }

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
        <li>
            <button
                onclick={async () => {
                    menuVisible = false;
                    tracks.cache = { ...tracks.cache, [selected.id]: selected };
                }}>Add to queue</button
            >
        </li>
        <li>
            <button
                onclick={async () => {
                    menuVisible = false;
                    const response = await deleteTrack(selected.id);
                    if (response.ok) {
                        console.log(`Track with id ${selected.id} deleted`);
                    }
                }}>Delete</button
            >
        </li>
    </ul>
{/if}
