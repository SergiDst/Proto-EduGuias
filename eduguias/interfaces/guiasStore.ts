import { CreateGuiaInput, Guia, GuiaTipo, UpdateGuiaInput } from "@/services/guiasServices";

export interface GuiasStore {
    guias: Guia[];
    loading: boolean;
    error: string | null;
    fetched: boolean;
    fetchGuias: (limitNumber?: number) => Promise<void>;
    fetchGuiasByTipo: (tipo: GuiaTipo, limitNumber?: number) => Promise<void>;
    createGuia: (data: CreateGuiaInput) => Promise<Guia>;
    updateGuia: (guiaId: string, data: UpdateGuiaInput) => Promise<void>;
    deleteGuia: (guiaId: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}
