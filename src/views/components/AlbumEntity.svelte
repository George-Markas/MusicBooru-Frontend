<script lang="ts">
    import { getTrackArt, type Track } from "../../lib/api/track";
    import { getContext, onDestroy, onMount } from "svelte";
    import TrackList from "./TrackList.svelte";
    import { getIcon, type Playlist } from "../../lib/api/playlist";

    let { tracks, playlist=null} = $props<{ tracks: Track[]; playlist?: Playlist }>();
    let cover = $state<string>("");

    const trackCache = getContext<{ cache: Record<string, Track> }>(
        "trackCache",
    );

    let open = getContext<{ name: string }>("openAlbum");
    let isOpen = $derived(open.name === (playlist?.name ?? tracks[0].album));

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
            cover = URL.createObjectURL(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    onMount(async () => {
        if (playlist !== null) {loadListArt();}
        else {loadArt();}
    });

    onDestroy(async () => {
        if (cover) {
            console.log("Track gone");
            URL.revokeObjectURL(cover);
        }
    });
</script>

<div class="album">
    <button
        class="button"
        ondblclick={() =>
            (trackCache.cache = Object.fromEntries(
                tracks.map((track: Track) => [track.id, track]),
            ))}
        onclick={() => (open.name = playlist?.name ?? tracks[0].album)}
    >
        <img src={cover} alt="cover" />
        <span>{playlist?.name ?? tracks[0].album}</span>
    </button>

    <div class="popup" class:open={isOpen}>
        <TrackList data={tracks} playlist={playlist}/>
    </div>
</div>

<style>
    .button {
        position: relative;
        padding: 0;
        border: none;
        cursor: pointer;
        width: 140px;
        height: 140px;
        overflow: hidden;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    span {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 4px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
    }

    .album {
        display: flex-start;
        flex-direction: column;
    }

    .popup {
        max-height: 0;
        overflow: hidden;
    }

    .popup.open {
        max-height: 300px;
    }
</style>
