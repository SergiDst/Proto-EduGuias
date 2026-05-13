import { useEffect, RefObject } from "react";

/** Traps focus inside the given container while `active` is true. */
export function useFocusTrap(
    containerRef: RefObject<HTMLElement | null>,
    active: boolean
) {
    useEffect(() => {
        if (!active || !containerRef.current) return;
        const container = containerRef.current;
        const previouslyFocused = document.activeElement as HTMLElement | null;

        const focusableSelectors = [
            "button:not([disabled])",
            "a[href]",
            "input:not([disabled])",
            "select:not([disabled])",
            "textarea:not([disabled])",
            "[tabindex]:not([tabindex='-1'])",
            "[role='button']:not([disabled])",
        ].join(",");

        const focusables = container.querySelectorAll<HTMLElement>(focusableSelectors);
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        first?.focus();

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key !== "Tab") return;
            if (focusables.length === 0) return;
            const isShift = event.shiftKey;
            const active = document.activeElement;
            if (isShift && active === first) {
                event.preventDefault();
                last?.focus();
            } else if (!isShift && active === last) {
                event.preventDefault();
                first?.focus();
            }
        }

        container.addEventListener("keydown", handleKeyDown);
        return () => {
            container.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [active, containerRef]);
}
