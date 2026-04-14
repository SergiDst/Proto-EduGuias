import { create } from "zustand";

export interface GlobalModalState {
    titulo: string;
    descripcion: string;
    visible: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    showConfirm?: boolean;
    imageIcon?: React.ReactElement;
}

interface UiStore {
    globalModal: GlobalModalState;
    headerVisible: boolean;
    setGlobalModal: (modal: Partial<GlobalModalState>) => void;
    setHeaderVisible: (visible: boolean) => void;
}

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