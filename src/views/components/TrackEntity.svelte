<script lang="ts">
    import { getContext } from "svelte";
    import { type Track } from "../../lib/api/track";
    import "../../assets/styles/track.css";

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
