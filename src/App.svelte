<script lang="ts">
    import Login from "./views/Login.svelte";
    import { type AppState } from "./lib/api/common";

    import { onMount, setContext } from "svelte";
    import Home from "./views/Home.svelte";
    import { getSession, type SessionData } from "./lib/api/auth";
    import type { Track } from "./lib/api/track";
    import TrackPlayer from "./views/components/Player.svelte";
    // import Playlist from "./views/Playlist.svelte";
    import Sidebar from "./views/components/Sidebar.svelte";
    import { persistedState } from "./lib/persisted.svelte";

    // const app = $state({ page: "loading" as AppState });
    let app = persistedState<{ page: AppState }>("app", { page: "loading" });
    setContext("app", app.value);

    const session = $state({ username: "", role: "" } as SessionData);
    setContext("session", session);

    let tracks = $state({ cache: [] as Track[] });
    setContext("trackCache", tracks);

    let activeTrack = $state({ id: "" });
    setContext("activeTrack", activeTrack);

    onMount(async () => {
        try {
            const response = await getSession();
            if (response.ok) {
                app.value.page = "home";
                session.username = response.data.username;
                session.role = response.data.role;
            } else {
                app.value.page = "login";
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if app.value.page === "login"}
    <Login />
{:else}
    {#if app.value.page === "home"}
        <Home />
    <!-- {:else if app.value.page === "playlists"}
        <Playlist/> -->
    {/if}
    <TrackPlayer />
    <Sidebar/>
{/if}