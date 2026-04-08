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
    setGlobalModal: (modal: Partial<GlobalModalState>) => void;
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

    setGlobalModal: (modal) => {
        set((state) => ({
            globalModal: {
                ...state.globalModal,
                ...modal,
            },
        }));
    },
}));