import { create } from "zustand";
import { GlobalModalState, Microtip, UiStore } from "@/interfaces/uiStore";

export type { GlobalModalState, Microtip };

const defaultGlobalModal: GlobalModalState = {
    titulo: "",
    descripcion: "",
    visible: false,
    onClose: () => {},
    showConfirm: false,
    imageIcon: undefined,
    onConfirm: undefined,
};

const TOAST_AUTO_MOVE_MS = 5000;

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUiStore = create<UiStore>((set, get) => ({
    globalModal: defaultGlobalModal,
    headerVisible: true,
    editorSectionCompletion: {},
    microtips: [],
    activeMicrotipToast: null,

    setGlobalModal: (modal) => {
        set((state) => ({
            globalModal: {
                ...state.globalModal,
                ...modal,
            },
        }));
    },

    setHeaderVisible: (visible) => {
        set({ headerVisible: visible });
    },

    setEditorSectionCompleted: (section, completed) => {
        set((state) => ({
            editorSectionCompletion: {
                ...state.editorSectionCompletion,
                [section]: completed,
            },
        }));
    },

    resetEditorSectionCompletion: () => {
        set({ editorSectionCompletion: {} });
    },

    addMicrotip: (tip) => {
        const state = get();
        const existing = state.microtips.find(
            (t) => t.title === tip.title && t.section === tip.section && !t.dismissed
        );
        if (existing) return;

        const newTip: Microtip = {
            ...tip,
            id: `${tip.section}-${tip.type}-${Date.now()}`,
            createdAt: Date.now(),
            dismissed: false,
            movedToSidebar: false,
        };

        set((s) => ({
            microtips: [...s.microtips, newTip],
            activeMicrotipToast: s.activeMicrotipToast ?? newTip,
        }));

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            get().moveTipToSidebar(newTip.id);
        }, TOAST_AUTO_MOVE_MS);
    },

    dismissMicrotipToast: () => {
        const { activeMicrotipToast } = get();
        if (!activeMicrotipToast) return;

        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }

        get().moveTipToSidebar(activeMicrotipToast.id);
    },

    moveTipToSidebar: (id) => {
        set((state) => {
            const updated = state.microtips.map((t) =>
                t.id === id ? { ...t, movedToSidebar: true } : t
            );
            const nextToast = updated.find((t) => !t.movedToSidebar && !t.dismissed);
            return {
                microtips: updated,
                activeMicrotipToast: nextToast ?? null,
            };
        });
    },

    dismissSidebarTip: (id) => {
        set((state) => ({
            microtips: state.microtips.map((t) =>
                t.id === id ? { ...t, dismissed: true } : t
            ),
        }));
    },

    clearMicrotipsForSection: (section) => {
        set((state) => ({
            microtips: state.microtips.filter((t) => t.section !== section),
            activeMicrotipToast:
                state.activeMicrotipToast?.section === section
                    ? null
                    : state.activeMicrotipToast,
        }));
    },

    resetMicrotips: () => {
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
        set({ microtips: [], activeMicrotipToast: null });
    },
}));
