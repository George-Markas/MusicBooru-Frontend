<script lang="ts">
    import { createPlaylist, type CreatePlaylistRequest} from "../../lib/api/playlist";
    import "../../assets/styles/sidebar.css";

    let dialog: HTMLDialogElement;

    let playlistData = $state<CreatePlaylistRequest>({
        name: "",
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        try {
            const response = await createPlaylist(playlistData.name);
            if (response.ok) {
                console.log(response.data);
            }
        } catch (error) {
            console.error(error);
        }
        dialog.close();
    }
</script>

<button class="register-trigger" onclick={() => dialog.showModal()}>CREATE PLAYLIST</button>

<dialog class="register-dialog" bind:this={dialog}>
    <div class="register-dialog__header">
        <span class="register-dialog__title">CREATE PLAYLIST</span>
        <button class="register-dialog__close" onclick={() => dialog.close()}>✕</button>
    </div>

    <form class="register-form" onsubmit={handleSubmit}>
        <label class="register-form__label">
            <span class="register-form__label-text">PLAYLIST NAME</span>
            <input
                class="register-form__input"
                type="text"
                name="Playlist name field"
                bind:value={playlistData.name}
                placeholder="List name..."
            />
        </label>
        <button type="submit" class="register-form__submit">SUBMIT</button>
    </form>
</dialog>