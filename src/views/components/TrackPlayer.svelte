<script lang="ts">
    import { getContext, untrack } from "svelte";
    import { streamTrack, type Track } from "../../lib/api/track";

    type StreamMode = "normal" | "shuffle" | "loop";

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");
    const active = getContext<{ id: string }>("activeTrack");

    let objectURL = $state<string>("");
    const method = $state<StreamMode>("normal");

    let queue = $derived(
        method === "shuffle"
            ? Object.keys(tracks.cache).sort(() => Math.random() - 0.5)
            : Object.keys(tracks.cache),
    );

    let index = $state(0);
    function handleEnded() {
        if (method === "loop" && index === queue.length) {
            index = 0;
            return;
        }

        if (index < queue.length - 1) {
            index += 1;
            active.id = queue[index];
        }
    }

    async function getStream(id: string) {
        try {
            const response = await streamTrack(id);
            if (response.ok) {
                untrack(() => {
                    objectURL = URL.createObjectURL(response.data);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    $effect(() => {
        if (queue.length === 0) return;
        index = 0;
        active.id = queue[0];
    });

    $effect(() => {
        const id = active.id;
        if (id === "") return;
        getStream(id);

        return () => {
            untrack(() => {
                URL.revokeObjectURL(objectURL);
            });
        };
    });
</script>

<div>
    <audio src={objectURL} controls autoplay onended={handleEnded}></audio>
</div>
