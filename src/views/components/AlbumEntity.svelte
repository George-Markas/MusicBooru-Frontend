<script lang="ts">
    import { getTrackArt, type Track } from "../../lib/api/track";
    import { getContext, onDestroy, onMount } from "svelte";
    import TrackList from "./TrackList.svelte";
    import { getIcon, type Playlist } from "../../lib/api/playlist";
    import "../../assets/styles/album-entity.css";

    let { tracks, playlist=null} = $props<{ tracks: Track[]; playlist?: Playlist }>();
    let cover = $state<string>("");
    let localData = $state({ list: [...tracks] });
    let albumElement = $state<HTMLDivElement | null>(null);

    const trackCache = getContext<{ cache: Record<string, Track> }>("trackCache");

    let open = getContext<{ name: string }>("openAlbum");
    let isOpen = $derived(open.name === (playlist?.name ?? localData.list[0]?.album));

    async function loadArt() {
        try {
            const response = await getTrackArt(localData.list[0].id);
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
            if (response.data !== undefined) { cover = URL.createObjectURL(response.data); }
        } catch (error) {
            console.error(error);
        }
    }

    function onRemove(id: string) {
        localData.list = localData.list.filter(t => t.id !== id);
    }

    function handleOutsideClick(e: MouseEvent) {
        if (isOpen && albumElement && !albumElement.contains(e.target as Node)) {
            open.name = "";
        }
    }

    onMount(async () => {
        if (playlist !== null) { loadListArt(); }
        else { loadArt(); }
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
                localData.list.map((track: Track) => [track.id, track]),
            ))}
        onclick={() => (open.name = playlist?.name ?? localData.list[0]?.album)}
    >
        <img src={cover} alt="cover" />
        <span>{playlist?.name ?? localData.list[0]?.album}</span>
    </button>

    <div class="popup" class:open={isOpen}>
        <TrackList data={localData.list} playlist={playlist} {onRemove}/>
    </div>

    {#if isOpen}
        <div class="popup">
            <div class="popup__inner">
                <TrackList data={tracks} />
            </div>
        </div>
    {/if}
</div>