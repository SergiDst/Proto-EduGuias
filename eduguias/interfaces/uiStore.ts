import type { EditorSectionId } from "@/constants/editorRouting";

export interface GlobalModalState {
    titulo: string;
    descripcion: string;
    visible: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    showConfirm?: boolean;
    imageIcon?: React.ReactElement;
}

export type MicrotipType = "WCAG" | "UDL" | "Clarity";

export interface Microtip {
    id: string;
    type: MicrotipType;
    title: string;
    body: string;
    section: EditorSectionId;
    createdAt: number;
    dismissed: boolean;
    movedToSidebar: boolean;
}

export interface UiStore {
    globalModal: GlobalModalState;
    headerVisible: boolean;
    editorSectionCompletion: Partial<Record<EditorSectionId, boolean>>;
    microtips: Microtip[];
    activeMicrotipToast: Microtip | null;
    setGlobalModal: (modal: Partial<GlobalModalState>) => void;
    setHeaderVisible: (visible: boolean) => void;
    setEditorSectionCompleted: (section: EditorSectionId, completed: boolean) => void;
    resetEditorSectionCompletion: () => void;
    addMicrotip: (tip: Omit<Microtip, "id" | "createdAt" | "dismissed" | "movedToSidebar">) => void;
    dismissMicrotipToast: () => void;
    moveTipToSidebar: (id: string) => void;
    dismissSidebarTip: (id: string) => void;
    clearMicrotipsForSection: (section: EditorSectionId) => void;
    resetMicrotips: () => void;
}
