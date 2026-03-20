<script lang="ts">
    import Login from "./views/Login.svelte";
    import { type AppState } from "./lib/api/common";

    import { onMount, setContext } from "svelte";
    import Home from "./views/Home.svelte";
    import { getSession, type SessionData } from "./lib/api/auth";
    import type { Track } from "./lib/api/track";
    import TrackPlayer from "./views/components/TrackPlayer.svelte";

    const app = $state({ page: "loading" as AppState });
    setContext("app", app);

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
                app.page = "home";
                session.username = response.data.username;
                session.role = response.data.role;
            } else {
                app.page = "login";
            }
        } catch (error) {
            console.error(error);
        }
    });
</script>

{#if app.page === "login"}
    <Login />
{:else}
    {#if app.page === "home"}
        <Home />
        <!-- {:else TODO PLAYLISTS} -->
    {/if}
    <TrackPlayer />
{/if}
