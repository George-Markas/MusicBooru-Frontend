<script lang="ts">
    import { type AppState, type ViewMode } from "../lib/api/common";
    import { type Track, getTracks} from "../lib/api/track";

    import { getContext, setContext, onMount } from "svelte";
    import { persistedState } from "../lib/persisted.svelte";

    import TrackList from "./components/TrackList.svelte";
    import SearchBar from "./components/SearchBar.svelte";
    import AlbumList from "./components/AlbumList.svelte";
    import "../assets/styles/home.css";

    const app = getContext<{ page: AppState }>("app");

    let tracks = $state({ list: [] as Track[] });
    setContext("tracklist", tracks);

    let albums = $derived(
        Object.values(
            tracks.list.reduce(
                (acc, track) => {
                    (acc[track.album] ??= []).push(track);
                    return acc;
                },
                {} as Record<string, Track[]>,
            ),
        ),
    );

    let streamTrack = $state({ id: "" });
    setContext("streamTrack", streamTrack);

    let view = persistedState<{ mode: ViewMode }>("view", { mode: "Track" });

    setContext("view", view.value);
    
    onMount(async () => {
        try {
            const response = await getTracks();
            if (response.ok) {
                tracks.list = response.data;
            } else {
                app.page = "login";
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

<SearchBar/>
{#if view.value.mode === "Album"}
    <AlbumList {albums} />
{:else}
    <TrackList data={tracks.list} />
{/if}

