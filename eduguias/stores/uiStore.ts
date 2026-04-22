import { create } from "zustand";
import { GlobalModalState, UiStore } from "@/interfaces/uiStore";

export type { GlobalModalState };

const defaultGlobalModal: GlobalModalState = {
    titulo: "",
    descripcion: "",
    visible: false,
    onClose: () => {},
    showConfirm: false,
    imageIcon: undefined,
    onConfirm: undefined,
};

export const useUiStore = create<UiStore>((set) => ({
    globalModal: defaultGlobalModal,
    headerVisible: true,

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
}));