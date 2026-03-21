<script lang="ts">
    import { getContext } from "svelte";
    import { logout, type SessionData } from "../../lib/api/auth";
    import type { AppState } from "../../lib/api/common";
    import RegisterModal from "./RegisterModal.svelte";
    import "../../assets/styles/sidebar.css";
    import { uploadTrack } from "../../lib/api/track";
    import PlaylistModal from "./PlaylistModal.svelte";

    const app = getContext<{ page: AppState }>("app");
    const session = getContext<SessionData>("session");
    let isOpen = $state(false);

    async function handleLogout() {
        try {
            const response = await logout();
            if (response.ok) {
                app.page = "login";
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

    function handleMouseMove(e: MouseEvent) {
        // Open when cursor is within 32px of the right edge
        const threshold = 32;
        if (e.clientX >= window.innerWidth - threshold) {
            isOpen = true;
        }
    }
</script>

<svelte:window onmousemove={handleMouseMove} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    class="sidebar"
    class:open={isOpen}
    onmouseleave={() => (isOpen = false)}
>
    <div class="sidebar__header">
        <span class="sidebar__username">{session.username}</span>
        <span class="sidebar__role">{session.role}</span>
    </div>

    <div class="sidebar__divider"></div>

    <nav class="sidebar__nav">
        <button class="sidebar__btn" onclick={() => (app.page = "home")}>
            LIBRARY
        </button>
        <button class="sidebar__btn" onclick={() => (app.page = "playlists")}>
            PLAYLISTS
        </button>
    </nav>

    <div class="sidebar__divider"></div>

    <div class="sidebar__footer">
        <PlaylistModal/>
        {#if session.role === "ADMIN"}
            <RegisterModal showTrigger />
            <input class="sidebar__input" type="file" accept="audio/m4a" onchange={handleUpload} multiple />

        {/if}
        <button class="sidebar__btn sidebar__btn--danger" onclick={handleLogout}>
            LOGOUT
        </button>
    </div>
</div>