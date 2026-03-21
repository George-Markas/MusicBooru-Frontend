<script lang="ts">
    import { onMount } from "svelte";
    import { getPlaylists, getPlaylistTracks, type Playlist } from "../lib/api/playlist";
    import { type Track } from "../lib/api/track";
    import AlbumList from "./components/AlbumList.svelte";
    
    let playlists = $state({ data: [] as Playlist[] });
    let trackCollection = $state<Track[][]>([]);

    onMount(async () => {
        try {
            const response = await getPlaylists();
            if (response.ok) {
                playlists.data = response.data;
            }
        } catch (error) {
            console.error(error);
        }
    });

    $effect(() => { 
    Promise.all(
        playlists.data.map((playlist: Playlist) => getPlaylistTracks(playlist.id))
    ).then(results => {
        trackCollection = results.map(response => 
            response.ok ? response.data : []
        );
    });});
</script>

<AlbumList albums={trackCollection} playListData={playlists.data}/>
