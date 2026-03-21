<script lang="ts">
    import { getContext } from "svelte";
    import type { SortMode, ViewMode } from "../../lib/api/common";
    import { searchTracks, type Track } from "../../lib/api/track";
    import "../../assets/styles/search.css";

    let debounceTimer: ReturnType<typeof setTimeout>;

    const tracks = getContext<{ list: Track[] }>("tracklist");
    const view = getContext<{ mode: ViewMode }>("view");

    async function handleSearch(query: string) {
        try {
            const response = await searchTracks(query);
            if (response.ok) {
                tracks.list = response.data;
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function handleSort(by: SortMode) {
        tracks.list = [...tracks.list].sort((a, b) =>
            a[by].localeCompare(b[by], undefined, { sensitivity: "base" }),
        );
    }

    function handleInputMulti(e: Event) {
        const query = (e.target as HTMLInputElement).value as SortMode;

        if (query === "title") {
            view.mode = "Track";
        }

        handleSort(query);
    }

    function handleInputSearch(e: Event) {
        const query = (e.target as HTMLInputElement).value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => handleSearch(query), 300);
    }
</script>

<div class="searchbar">
    <span class="logo">MusicBooru</span>
    <div class="searchbar__search">
        <svg
            viewBox="0 0 16 16"
            fill="none"
            class="searchbar__icon"
            aria-hidden="true"
        >
            <circle
                cx="6.5"
                cy="6.5"
                r="4.5"
                stroke="currentColor"
                stroke-width="1.2"
            />
            <line
                x1="10"
                y1="10"
                x2="14"
                y2="14"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="square"
            />
        </svg>
        <input
            type="search"
            name="search bar"
            placeholder="SEARCH BY TITLE, ARTIST OR ALBUM..."
            oninput={handleInputSearch}
            class="searchbar__input"
        />
    </div>

    <div class="searchbar__controls">
        <div class="searchbar__sort">
            <label for="options" class="searchbar__label">SORT</label>
            <select
                id="options"
                onchange={handleInputMulti}
                class="searchbar__select"
            >
                {#if view.mode === "Track"}
                    <option value="title">TITLE</option>
                {/if}
                <option value="album">ALBUM</option>
                <option value="artist">ARTIST</option>
            </select>
        </div>

        <div class="searchbar__view">
            <button
                class="searchbar__view-btn"
                class:searchbar__view-btn--active={view.mode === "Album"}
                onclick={() => {
                    if (view.mode !== "Album") {
                        view.mode = "Album";
                        handleSort("album");
                    }
                }}
            >
                COVER
            </button>
            <button
                class="searchbar__view-btn"
                class:searchbar__view-btn--active={view.mode === "Track"}
                onclick={() => (view.mode = "Track")}
            >
                TRACK
            </button>
        </div>
    </div>
</div>
