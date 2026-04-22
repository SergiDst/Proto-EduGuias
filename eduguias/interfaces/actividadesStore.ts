import { Actividad, CreateActividadInput, UpdateActividadInput } from "@/services/actividadesServices";

export interface ActividadesStore {
    actividades: Actividad[];
    selectedActividad: Actividad | null;
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
    deleteActividad: (uid: string, actividadId: string) => Promise<void>;
    clearSelectedActividad: () => void;
    clearError: () => void;
    reset: () => void;
}
