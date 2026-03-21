<script lang="ts">
    import { type AppState } from "../lib/api/common";
    import { getContext } from "svelte";
    import { authenticate, getSession, type SessionData } from "../lib/api/auth";
    import "../assets/styles/login.css";

    let username = $state("");
    let password = $state("");
    let error = $state("");

    const app = getContext<{page: AppState }>('app');
    const session = getContext<SessionData>("session");

    async function renewSession() {
        try {
            const response = await getSession();
            if (response.ok) {
                session.username = response.data.username;
                session.role = response.data.role;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(event: Event) {
        event.preventDefault();
        username = username.trim();
        password = password.trim();
        try {
            const response = await authenticate({ username, password });
            if (response.ok) {
                app.page = "home";
                console.log(response.data);
                renewSession();
            } else if (response.status === 401) {
                error = "Incorrect username or password";
            }
        } catch (error) {
            console.error(error);
        }
    }
</script>

<div class="login-page">
    <div class="login-card">
        <span class="login-wordmark">Welcome to MusicBooru</span>
        <form onsubmit={handleSubmit} class="login-form">
            <input
                type="text"
                name="login username field"
                bind:value={username}
                oninput={() => (error = "")}
                placeholder="USERNAME"
                class="login-input"
                class:login-input--error={error}
            />
            <input
                type="password"
                name="login password field"
                bind:value={password}
                oninput={() => (error = "")}
                placeholder="PASSWORD"
                class="login-input"
                class:login-input--error={error}
            />

            {#if error}
                <span class="login-error">{error}</span>
            {/if}
            <button type="submit" class="login-btn">LOGIN</button>
        </form>
    </div>
</div>
