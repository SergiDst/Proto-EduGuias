import { useEffect } from "react";

/** Calls `onEscape` when the user presses the Escape key while `active` is true. */
export function useEscapeKey(active: boolean, onEscape: () => void) {
    useEffect(() => {
        if (!active) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                event.stopPropagation();
                onEscape();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [active, onEscape]);
}
