<script lang="ts">
    import { getTrackArt, type Track } from "../../lib/api/track";
    import { getContext, onDestroy, onMount } from "svelte";
    import TrackList from "./TrackList.svelte";
    import "../../assets/styles/album.css";

    let { tracks } = $props<{ tracks: Track[] }>();
    let cover = $state<string>("");

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

    onMount(async () => {
        loadArt();
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
        onclick={() => (open.name = tracks[0].album)}
    >
        <img src={cover} alt="cover" />
    </button>

    <div class="album-info">
        <span class="album-name">{tracks[0].album}</span>
        <span class="artist-name">{tracks[0].artist}</span>
    </div>

    <div class="popup" class:open={isOpen}>
        <TrackList data={tracks} />
    </div>
</div>
