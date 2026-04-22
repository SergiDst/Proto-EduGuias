import {
    Actividad,
    CreateActividadInput,
    CuestionarioPayload,
    UpdateActividadInput,
} from "@/interfaces/actividades";

export interface ActividadesStore {
    actividades: Actividad[];
    selectedActividad: Actividad | null;
    questionnaireDraft: CuestionarioPayload | null;
    loading: boolean;
    error: string | null;
    fetched: boolean;
    fetchActividadesByUser: (uid: string) => Promise<void>;
    fetchActividadById: (uid: string, actividadId: string) => Promise<Actividad | null>;
    createActividad: (uid: string, data: CreateActividadInput) => Promise<Actividad>;
    updateActividad: (
        uid: string,
        actividadId: string,
        data: UpdateActividadInput
    ) => Promise<void>;
    setQuestionnaireDraft: (payload: CuestionarioPayload) => void;
    updateSelectedActividadPayload: (payload: CuestionarioPayload) => void;
    deleteActividad: (uid: string, actividadId: string) => Promise<void>;
    clearSelectedActividad: () => void;
    clearQuestionnaireDraft: () => void;
    clearError: () => void;
    reset: () => void;
}
