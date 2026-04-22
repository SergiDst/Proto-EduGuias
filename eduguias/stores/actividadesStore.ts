import { create } from "zustand";
import { ActividadesStore } from "@/interfaces/actividadesStore";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import {
    createActividadByUser,
    deleteActividadByUser,
    getActividadById,
    getActividadesByUser,
    updateActividadByUser,
} from "@/services/actividadesServices";

const initialState = {
    actividades: [],
    selectedActividad: null,
    loading: false,
    error: null as string | null,
    fetched: false,
};

export const useActividadesStore = create<ActividadesStore>((set) => ({
    ...initialState,

    fetchActividadesByUser: async (uid) => {
        set({ loading: true, error: null });

        try {
            const actividades = await getActividadesByUser(uid);
            set({ actividades, loading: false, fetched: true });
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    fetchActividadById: async (uid, actividadId) => {
        set({ loading: true, error: null });

        try {
            const actividad = await getActividadById(uid, actividadId);
            set({ selectedActividad: actividad, loading: false });
            return actividad;
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    createActividad: async (uid, data) => {
        set({ loading: true, error: null });

        try {
            const nuevaActividad = await createActividadByUser(uid, data);

            set((state) => ({
                actividades: [nuevaActividad, ...state.actividades],
                loading: false,
                fetched: true,
            }));

            return nuevaActividad;
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    updateActividad: async (uid, actividadId, data) => {
        set({ loading: true, error: null });

        try {
            await updateActividadByUser(uid, actividadId, data);

            set((state) => ({
                actividades: state.actividades.map((actividad) =>
                    actividad.id === actividadId
                        ? {
                              ...actividad,
                              ...data,
                              updatedAt: new Date(),
                          }
                        : actividad
                ),
                selectedActividad:
                    state.selectedActividad?.id === actividadId
                        ? {
                              ...state.selectedActividad,
                              ...data,
                              updatedAt: new Date(),
                          }
                        : state.selectedActividad,
                loading: false,
            }));
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    deleteActividad: async (uid, actividadId) => {
        set({ loading: true, error: null });

        try {
            await deleteActividadByUser(uid, actividadId);

            set((state) => ({
                actividades: state.actividades.filter(
                    (actividad) => actividad.id !== actividadId
                ),
                selectedActividad:
                    state.selectedActividad?.id === actividadId
                        ? null
                        : state.selectedActividad,
                loading: false,
            }));
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    clearSelectedActividad: () => {
        set({ selectedActividad: null });
    },

    clearError: () => {
        set({ error: null });
    },

    reset: () => {
        set(initialState);
    },
}));