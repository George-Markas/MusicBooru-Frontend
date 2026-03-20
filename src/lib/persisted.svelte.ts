export function persistedState<T>(key: string, initial: T) {
    const stored = localStorage.getItem(key);
    let value = $state<T>(stored ? JSON.parse(stored) : initial);

    $effect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    })

    return {
        get value() { return value },
        set value(v: T) { value = v; }
    };
}

