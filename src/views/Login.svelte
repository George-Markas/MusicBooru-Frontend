<script lang="ts">
    import { type AppState } from '../lib/api/common';

    import { getContext } from 'svelte';
    import {authenticate} from '../lib/api/auth';

    let username = $state('');
    let password = $state('');

    const app = getContext<{page: AppState }>('app');

    async function handleSubmit(event: Event) {
        event.preventDefault();
        username = username.trim();
        password = password.trim();
        try {
            const response = await authenticate({username, password});
            if (response.ok) {app.page = 'home'; console.log(response.data);}
        } catch (error) {
            console.error(error);
        }
    }
</script>

<form onsubmit={handleSubmit}>
    <input
        type="text"
        name="login field username"
        bind:value={username}
        placeholder="Username"
    />
    <input
        type="text"
        name="login field password"
        bind:value={password}
        placeholder="Password"
    />
    <button type="submit">Login</button>
</form>
