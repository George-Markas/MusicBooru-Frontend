<script lang="ts">
    import { getTrackArt, type Track } from "../../lib/api/track";
    import { getContext, onDestroy, onMount } from "svelte";
    import TrackList from "./TrackList.svelte";

    let { tracks } = $props<{ tracks: Track[] }>();
    let cover = $state<string>("");
    let albumEl = $state<HTMLDivElement | null>(null);

    const trackCache = getContext<{ cache: Record<string, Track> }>(
        "trackCache",
    );

    let open = getContext<{ name: string }>("openAlbum");
    let isOpen = $derived(open.name === tracks[0].album);

    async function loadArt() {
        try {
            const response = await getTrackArt(tracks[0].id);
            if (response.ok) {
                cover = URL.createObjectURL(response.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function handleOutsideClick(e: MouseEvent) {
        if (isOpen && albumEl && !albumEl.contains(e.target as Node)) {
            open.name = "";
        }
    }

    onMount(async () => {
        loadArt();
    });

    onDestroy(async () => {
        if (cover) {
            URL.revokeObjectURL(cover);
        }
    });
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="album" bind:this={albumEl}>
    <button
        class="album__button"
        ondblclick={() =>
            (trackCache.cache = Object.fromEntries(
                tracks.map((track: Track) => [track.id, track]),
            ))}
        onclick={() =>
            (open.name = open.name === tracks[0].album ? "" : tracks[0].album)}
    >
        <img src={cover} alt="cover" class="album__cover" />
    </button>

    <div class="album__info">
        <span class="album__name">{tracks[0].album}</span>
        <span class="album__artist">{tracks[0].artist}</span>
    </div>

    {#if isOpen}
        <div class="popup">
            <div class="popup__inner">
                <TrackList data={tracks} />
            </div>
        </div>
    {/if}
</div>

