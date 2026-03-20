<script lang="ts">
    import { getContext, untrack } from "svelte";
    import { streamTrack, type Track } from "../../lib/api/track";
    import "../../assets/styles/player.css";

    type StreamMode = "normal" | "shuffle" | "loop";

    const tracks = getContext<{ cache: Record<string, Track> }>("trackCache");
    const active = getContext<{ id: string }>("activeTrack");

    let objectURL = $state<string>("");
    let method = $state<StreamMode>("normal");
    let volume = $state(1);
    let audioElement = $state<HTMLAudioElement | null>(null);
    let volumeElement = $state<HTMLInputElement | null>(null);
    let seekElement = $state<HTMLInputElement | null>(null);
    let currentTime = $state(0);
    let duration = $state(0);
    let isSeeking = $state(false);
    let isPlaying = $state(false);

    let queue = $derived(
        method === "shuffle"
            ? Object.keys(tracks.cache).sort(() => Math.random() - 0.5)
            : Object.keys(tracks.cache),
    );

    let index = $state(0);

    function handleEnded() {
        if (method === "loop" && index === queue.length - 1) {
            index = 0;
            return;
        }
        if (index < queue.length - 1) {
            index += 1;
            active.id = queue[index];
        }
    }

    function formatTime(s: number): string {
        if (!isFinite(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60)
            .toString()
            .padStart(2, "0");
        return `${m}:${sec}`;
    }

    $effect(() => {
        if (audioElement) audioElement.volume = volume;
    });

    $effect(() => {
        if (!audioElement || isSeeking) return;
        currentTime = audioElement.currentTime;
    });

    $effect(() => {
        volumeElement?.style.setProperty("--fill", `${volume * 100}%`);
    });

    async function getStream(id: string) {
        try {
            const response = await streamTrack(id);
            if (response.ok) {
                untrack(() => {
                    objectURL = URL.createObjectURL(response.data);
                    currentTime = 0;
                    duration = 0;
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

    let title = $derived(tracks.cache[active.id]?.title ?? "No tracks queued");
    let artist = $derived(
        tracks.cache[active.id]?.artist
            ? `• ${tracks.cache[active.id].artist}`
            : "",
    );

    function setMode(m: StreamMode) {
        method = m;
    }
    function prev() {
        if (index > 0) {
            index -= 1;
            active.id = queue[index];
        }
    }
    function next() {
        handleEnded();
    }

    function onSeekInput(e: Event) {
        isSeeking = true;
        currentTime = Number((e.target as HTMLInputElement).value);
        updateSeekFill();
    }

    function onSeekChange(e: Event) {
        const t = Number((e.target as HTMLInputElement).value);
        if (audioElement) audioElement.currentTime = t;
        isSeeking = false;
    }

    function updateSeekFill() {
        if (!audioElement) return;
        const percent = (currentTime / (duration || 1)) * 100;
        seekElement?.style.setProperty("--fill", `${percent}%`);
    }

    let equalizerElement = $state<HTMLDivElement | null>(null);
    const BLOCKS = 7;

    $effect(() => {
        if (!equalizerElement) return;

        const columns = [
            { min: 1, max: BLOCKS, speed: 120 },
            { min: 1, max: BLOCKS, speed: 180 },
            { min: 1, max: BLOCKS, speed: 100 },
            { min: 1, max: BLOCKS, speed: 150 },
            { min: 1, max: BLOCKS, speed: 130 },
        ];

        let intervals: ReturnType<typeof setInterval>[] = [];

        function setColumnHeight(columnElement: Element, lit: number) {
            const blocks = columnElement.querySelectorAll(".player__eq-block");
            blocks.forEach((block, i) => {
                const fromBottom = BLOCKS - 1 - i;
                (block as HTMLElement).classList.toggle(
                    "player__eq-block--lit",
                    fromBottom < lit,
                );
            });
        }

        function startAnimating() {
            const columnElements =
                equalizerElement!.querySelectorAll(".player__eq-col");
            columnElements.forEach((colEl, i) => {
                const { min, max, speed } = columns[i];
                intervals.push(
                    setInterval(() => {
                        const lit =
                            Math.floor(Math.random() * (max - min + 1)) + min;
                        setColumnHeight(colEl, lit);
                    }, speed),
                );
            });
        }

        function stopAnimating() {
            intervals.forEach(clearInterval);
            intervals = [];
            equalizerElement!
                .querySelectorAll(".player__eq-col")
                .forEach((columnElement) => setColumnHeight(columnElement, 1));
        }

        if (isPlaying) {
            startAnimating();
        } else {
            stopAnimating();
        }

        return () => {
            intervals.forEach(clearInterval);
        };
    });
</script>

<audio
    bind:this={audioElement}
    src={objectURL}
    autoplay
    onplay={() => {
        isPlaying = true;
    }}
    onpause={() => {
        isPlaying = false;
    }}
    onended={handleEnded}
    ontimeupdate={() => {
        if (!isSeeking && audioElement) {
            currentTime = audioElement.currentTime;
            updateSeekFill();
        }
    }}
    onloadedmetadata={() => {
        if (audioElement) duration = audioElement.duration;
    }}
    class="hidden"
></audio>

<div class="player">
    <div class="player__seek-row">
        <span class="player__time">{formatTime(currentTime)}</span>
        <input
            bind:this={seekElement}
            type="range"
            min="0"
            max={duration || 1}
            step="0.1"
            value={currentTime}
            oninput={onSeekInput}
            onchange={onSeekChange}
            class="player__seek-slider"
            aria-label="Seek"
        />
        <span class="player__time">{formatTime(duration)}</span>
    </div>

    <div class="player__bar">
        <div class="player__info">
            <span class="player__title-text">{title} {artist}</span>
            <span class="player__index">{index + 1} / {queue.length}</span>
        </div>

        <div class="player__controls">
            <button class="player__btn" onclick={prev} aria-label="Previous">
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="player__icon"
                >
                    <path d="M4 4h2v12H4V4zm10 0L7 10l7 6V4z" />
                </svg>
            </button>

            <button
                class="player__btn player__btn--play"
                onclick={() =>
                    audioElement?.paused
                        ? audioElement.play()
                        : audioElement?.pause()}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {#if isPlaying}
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="player__icon player__icon--lg"
                    >
                        <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z" />
                    </svg>
                {:else}
                    <svg
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        class="player__icon player__icon--lg"
                    >
                        <path d="M6 4l12 6-12 6V4z" />
                    </svg>
                {/if}
            </button>

            <button class="player__btn" onclick={next} aria-label="Next">
                <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    class="player__icon"
                >
                    <path d="M14 4h2v12h-2V4zM4 4l7 6-7 6V4z" />
                </svg>
            </button>
        </div>

        <div class="player__secondary">
            <div class="player__modes">
                <button
                    class="player__mode-btn"
                    class:player__mode-btn--active={method === "normal"}
                    onclick={() => setMode("normal")}>SEQ</button
                >
                <button
                    class="player__mode-btn"
                    class:player__mode-btn--active={method === "shuffle"}
                    onclick={() => setMode("shuffle")}>SHF</button
                >
                <button
                    class="player__mode-btn"
                    class:player__mode-btn--active={method === "loop"}
                    onclick={() => setMode("loop")}>RPT</button
                >
            </div>
            <div class="player__volume">
                <span class="player__volume-label">VOL</span>
                <input
                    bind:value={volume}
                    bind:this={volumeElement}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    class="player__volume-slider"
                    aria-label="Volume"
                />
                <span class="player__volume-value"
                    >{Math.round(volume * 100)}</span
                >
            </div>

            <div
                class="player__eq"
                bind:this={equalizerElement}
                aria-hidden="true"
            >
                {#each [0, 1, 2, 3, 4] as col}
                    <div class="player__eq-col" data-col={col}>
                        {#each [0, 1, 2, 3, 4, 5, 6] as row}
                            <div class="player__eq-block"></div>
                        {/each}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
