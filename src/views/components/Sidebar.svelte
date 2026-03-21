<script lang="ts">
    import { getContext } from "svelte";
    import { logout, type SessionData } from "../../lib/api/auth";
    import type { AppState } from "../../lib/api/common";
    import RegisterModal from "./RegisterModal.svelte";

    const app = getContext<{ page: AppState }>("app");
    const session = getContext<SessionData>("session");
    let isOpen = $state(true);

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
</script>

<div class="sidebar" class:collapsed={!isOpen}>
    <button class="toggle" onclick={() => (isOpen = !isOpen)}>
        {isOpen ? "→" : "←"}
    </button>
    {#if session.role === 'ADMIN'}
        <RegisterModal />    
    {/if}
    <button onclick={handleLogout}>Logout</button>

    {#if isOpen}
        <button onclick={() => app.page = 'home'}>Home</button>
        <button onclick={() => app.page = 'playlists'}>Library</button>
    {/if}

    <p>{session.username}</p>
    <p>{session.role}</p>
</div>

<style>
    .sidebar {
        width: 250px;
        height: 100vh;
        background-color: #2c3e50;
        color: #ecf0f1;
        padding: 20px;
        position: fixed;
        right: 0;
        top: 0;
        transition: width 0.3s ease;
    }

    .sidebar.collapsed {
        width: 60px;
        padding: 20px 10px;
    }

    .toggle {
        background: #34495e;
        color: #ecf0f1;
        border: none;
        padding: 10px;
        width: 100%;
        cursor: pointer;
        border-radius: 4px;
        margin-bottom: 20px;
        font-size: 18px;
    }

    .toggle:hover {
        background: #3498db;
    }

    .sidebar button:not(.toggle) {
        display: block;
        width: 100%;
        color: #ecf0f1;
        background: transparent;
        border: none;
        text-align: left;
        padding: 12px 16px;
        margin-bottom: 8px;
        border-radius: 4px;
        transition: background-color 0.2s;
        white-space: nowrap;
        cursor: pointer;
        font-size: 16px;
    }

    .sidebar button:not(.toggle):hover {
        background-color: #34495e;
    }

</style>
