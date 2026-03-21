<script lang="ts">
    import { getTrackArt, type Track } from "../../lib/api/track";
    import { getContext, onDestroy, onMount } from "svelte";
    import TrackList from "./TrackList.svelte";
    import "../../assets/styles/album-entity.css";
    import { getIcon, type Playlist } from "../../lib/api/playlist";

    let { tracks, playlist = null } = $props<{
        tracks: Track[];
        playlist?: Playlist;
    }>();
    let cover = $state<string>("");
    let albumElement = $state<HTMLDivElement | null>(null);
    let localData = $state({ list: [...tracks] });

    const trackCache = getContext<{ cache: Record<string, Track> }>(
        "trackCache",
    );

    let open = getContext<{ name: string }>("openAlbum");
    let isOpen = $derived(
        open.name === (playlist?.name ?? localData.list[0]?.album),
    );

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

    async function loadListArt() {
        try {
            const response = await getIcon(playlist.id);
            if (response.data !== undefined) {
                cover = URL.createObjectURL(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function onRemove(id: string) {
        localData.list = localData.list.filter((t) => t.id !== id);
    }

    function handleOutsideClick(e: MouseEvent) {
        if (
            isOpen &&
            albumElement &&
            !albumElement.contains(e.target as Node)
        ) {
            open.name = "";
        }
    }

    onMount(async () => {
        if (playlist !== null) {
            loadListArt();
        } else {
            loadArt();
        }
    });

    onDestroy(async () => {
        if (cover) {
            URL.revokeObjectURL(cover);
        }
    });
</script>

<svelte:window onclick={handleOutsideClick} />

<div class="album" bind:this={albumElement}>
    <button
        class="album__button"
        ondblclick={() =>
            (trackCache.cache = Object.fromEntries(
                tracks.map((track: Track) => [track.id, track]),
            ))}
        onclick={() => (open.name = playlist?.name ?? localData.list[0]?.album)}
    >
        <img src={cover} alt="cover" class="album__cover" />
    </button>

    <div class="album__info">
        <span class="album__name"
            >{playlist?.name ?? localData.list[0]?.album}</span
        >
        <span class="album__artist"
            >{playlist ? null : localData.list[0]?.artist}</span
        >
    </div>

    {#if isOpen}
        <div class="popup">
            <div class="popup__inner">
                <TrackList data={tracks} {playlist} {onRemove} />
            </div>
        </div>
    {/if}
</div>
