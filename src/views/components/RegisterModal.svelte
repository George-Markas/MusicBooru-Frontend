<script lang="ts">
    import { register, type RegisterRequest } from "../../lib/api/auth";

    let dialog: HTMLDialogElement;

    let registerData = $state<RegisterRequest>({
        username: "",
        password: "",
        role: "USER",
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        try {
            const response = await register(registerData);
            if (response.ok) {
                console.log(response.data);
            }
        } catch (error) {
            console.error(error);
        }
        dialog.close();
    }
</script>

<button onclick={() => dialog.showModal()}>Register User</button>

<dialog bind:this={dialog}>
    <form onsubmit={handleSubmit}>
        <label>
            Username
            <input
                type="text"
                name="register username field"
                bind:value={registerData.username}
                placeholder="Username"
            />
        </label>
        <label>
            Password
            <input
                type="text"
                name="register password field"
                bind:value={registerData.password}
                placeholder="Password"
            />
        </label>
        <label>
            Admin
            <input
                type="checkbox"
                checked={registerData.role === "ADMIN"}
                onchange={(e) =>
                    (registerData.role = (e.target as HTMLInputElement).checked
                        ? "ADMIN"
                        : "USER")}
            />
        </label>
        <button type="submit">Submit</button>
    </form>
    <button onclick={() => dialog.close()}>✕</button>
</dialog>
