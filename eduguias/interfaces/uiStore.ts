export interface GlobalModalState {
    titulo: string;
    descripcion: string;
    visible: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    showConfirm?: boolean;
    imageIcon?: React.ReactElement;
}

export interface UiStore {
    globalModal: GlobalModalState;
    headerVisible: boolean;
    setGlobalModal: (modal: Partial<GlobalModalState>) => void;
    setHeaderVisible: (visible: boolean) => void;
}
