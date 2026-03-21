<script lang="ts">
    import { createPlaylist, type CreatePlaylistRequest} from "../../lib/api/playlist";

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

<button onclick={() => dialog.showModal()}>Create Playlist!</button>

<dialog bind:this={dialog}>
    <form onsubmit={handleSubmit}>
        <label>
            Playlist Name
            <input
                type="text"
                name="Playlist name field"
                bind:value={playlistData.name}
                placeholder="List Name..."
            />
        </label>
        <button type="submit">Submit</button>
    </form>
    <button onclick={() => dialog.close()}>✕</button>
</dialog>
