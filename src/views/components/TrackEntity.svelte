<script lang="ts">
    import { getContext } from "svelte";
    import { type Track } from "../../lib/api/track";

    let { trackData, oncontextmenu } = $props<{
        trackData: Track;
        oncontextmenu: (e: MouseEvent) => void;
    }>();

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");
</script>

<button
    class="list"
    {oncontextmenu}
    ondblclick={() => {
        tracks.cache = { [trackData.id]: trackData };
    }}
>
    <p class="track-title">{trackData.title}</p>
</button>

<style>
    .list {
        display: flex;
        align-items: left;
        gap: 0.1rem;
        width: 100%;
        padding: 0.1rem 0.1rem;
        border: none;
        border-bottom: 1px solid #eee;
        background: none;
        cursor: pointer;
        text-align: left;
        font-size: 0.8rem;
    }
</style>
