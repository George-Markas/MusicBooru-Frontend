<script lang="ts">
    import { register, type RegisterRequest } from "../../lib/api/auth";
    import "../../assets/styles/register-modal.css";

    let dialog: HTMLDialogElement;
    let { showTrigger = false } = $props<{ showTrigger?: boolean }>();

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

{#if showTrigger}
    <button class="register-trigger" onclick={() => dialog.showModal()}>
        REGISTER USER
    </button>
{/if}

<dialog bind:this={dialog} class="register-dialog">
    <div class="register-dialog__header">
        <span class="register-dialog__title">REGISTER USER</span>
        <button class="register-dialog__close" onclick={() => dialog.close()}>✕</button>
    </div>

    <form onsubmit={handleSubmit} class="register-form">
        <label class="register-form__label">
            <span class="register-form__label-text">USERNAME</span>
            <input
                type="text"
                name="register username field"
                bind:value={registerData.username}
                placeholder="USERNAME"
                class="register-form__input"
            />
        </label>

        <label class="register-form__label">
            <span class="register-form__label-text">PASSWORD</span>
            <input
                type="password"
                name="register password field"
                bind:value={registerData.password}
                placeholder="PASSWORD"
                class="register-form__input"
            />
        </label>

        <label class="register-form__checkbox-label">
            <input
                type="checkbox"
                checked={registerData.role === "ADMIN"}
                onchange={(e) =>
                    (registerData.role = (e.target as HTMLInputElement).checked
                        ? "ADMIN"
                        : "USER")}
                class="register-form__checkbox"
            />
            <span class="register-form__label-text">ADMIN</span>
        </label>

        <button type="submit" class="register-form__submit">SUBMIT</button>
    </form>
</dialog>