<script lang="ts">
    import { getContext } from "svelte";
    import { type Track } from "../../lib/api/track";

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

<style>
    .track-row {
        font-family: 'IBM Plex Mono', monospace;
        display: grid;
        grid-template-columns: 2fr 1.5fr 1.5fr 1fr 0.5fr 0.5fr;
        align-items: center;
        width: 100%;
        padding: 0.45rem 0.75rem;
        background: none;
        border: none;
        border-bottom: 1px solid #1a1a1a;
        cursor: pointer;
        text-align: left;
        transition: background 0.1s;
    }

    .track-row:hover {
        background: #161616;
    }

    .track__col {
        font-size: 0.8rem;
        letter-spacing: 0.05em;
        color: #e8e8e8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 1rem;
    }

    .track__col--title {
        color: #e8e8e8;
    }

    .track__col--duration,
    .track__col--year {
        text-align: right;
        padding-right: 0;
        color: #e8e8e8;
    }
</style>