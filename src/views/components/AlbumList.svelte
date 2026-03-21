<script lang="ts">
    import { setContext } from "svelte";
    import type { Track } from "../../lib/api/track";
    import AlbumEntity from "./AlbumEntity.svelte";
    import type { Playlist } from "../../lib/api/playlist";

    let { albums, playListData } = $props<{
        albums: Track[][];
        playListData?: Playlist[]
    }>();

    let open = $state({ name: "" as string });
    setContext("openAlbum", open);
</script>

<div class="album-list">
    {#each albums as tracks, i (tracks)}
        <AlbumEntity {tracks} playlist={playListData?.[i]} />
    {/each}
</div>

<style>
    .album-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, 140px);
        gap: 1rem;
        align-items: start;
    }
</style>
