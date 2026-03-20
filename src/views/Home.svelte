<script lang="ts">
    import { type AppState, type ViewMode } from "../lib/api/common";
    import { type Track, getTracks, uploadTrack } from "../lib/api/track";

    import { getContext, setContext, onMount } from "svelte";
    import { logout, type SessionData } from "../lib/api/auth";

    import TrackList from "./components/TrackList.svelte";
    import TrackPlayer from "./components/TrackPlayer.svelte";
    import SearchBar from "./components/SearchBar.svelte";
    import AlbumList from "./components/AlbumList.svelte";
    import RegisterModal from "./components/RegisterModal.svelte";

    const app = getContext<{ page: AppState }>("app");
    const session = getContext<SessionData>("session");

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
    setContext("stream", streamTrack);

    let view = $state({ mode: "Track" as ViewMode });
    setContext("view", view);

    async function handleLogout() {
        try {
            const response = await logout();
            if (response.ok) {
                app.page = "login";
                console.log(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleUpload(e: Event) {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("file", files[i]);
        }

        try {
            const response = await uploadTrack(formData);
            console.log(response.status);
            if (response.ok) {
                console.log(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

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

<p>88 == Welcome to musicbooru == 88</p>
<SearchBar />
<button onclick={handleLogout}>Logout</button>

{#if view.mode === "Album"}
    <AlbumList {albums} />
{:else}
    <TrackList data={tracks.list} mode={view.mode} />
{/if}

{#if session.role === "ADMIN"}
    <p>Hello ADMIN!</p>
{/if}

<input type="file" accept="audio/m4a" onchange={handleUpload} multiple />
<RegisterModal/>
<TrackPlayer trackId={streamTrack.id} />
