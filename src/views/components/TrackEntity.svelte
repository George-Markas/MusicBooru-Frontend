<script lang="ts">
    import { getContext } from "svelte";
    import { type Track } from "../../lib/api/track";
    import "../../assets/styles/track-entity.css";

    let { trackData, oncontextmenu } = $props<{
        trackData: Track;
        oncontextmenu: (e: MouseEvent) => void;
    }>();

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");

    function formatDuration(seconds: number): string {
        if (!seconds || !isFinite(seconds)) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }
</script>

<button
    class="track-row"
    {oncontextmenu}
    ondblclick={() => {
        tracks.cache = { [trackData.id]: trackData };
    }}
>
    <span class="track__col track__col--title">{trackData.title ?? "—"}</span>
    <span class="track__col track__col--artist">{trackData.artist ?? "—"}</span>
    <span class="track__col track__col--album">{trackData.album ?? "—"}</span>
    <span class="track__col track__col--genre">{trackData.genre ?? "—"}</span>
    <span class="track__col track__col--year">{trackData.year ?? "—"}</span>
    <span class="track__col track__col--duration">{formatDuration(trackData.duration)}</span>
</button>