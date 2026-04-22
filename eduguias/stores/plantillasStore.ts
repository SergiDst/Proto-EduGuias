import { create } from "zustand";
import { PlantillasStore } from "@/interfaces/plantillasStore";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import {
    createPlantilla,
    deletePlantilla,
    getPlantillas,
    updatePlantilla,
} from "@/services/plantillasServices";

const initialState = {
    plantillas: [],
    loading: false,
    error: null as string | null,
    fetched: false,
};

export const usePlantillasStore = create<PlantillasStore>((set) => ({
    ...initialState,

    fetchPlantillas: async (limitNumber) => {
        set({ loading: true, error: null });

        try {
            const plantillas = await getPlantillas(limitNumber);
            set({ plantillas, loading: false, fetched: true });
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    createPlantilla: async (data) => {
        set({ loading: true, error: null });

        try {
            const nuevaPlantilla = await createPlantilla(data);

            set((state) => ({
                plantillas: [nuevaPlantilla, ...state.plantillas],
                loading: false,
                fetched: true,
            }));

            return nuevaPlantilla;
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    updatePlantilla: async (plantillaId, data) => {
        set({ loading: true, error: null });

        try {
            await updatePlantilla(plantillaId, data);

            set((state) => ({
                plantillas: state.plantillas.map((plantilla) =>
                    plantilla.id === plantillaId
                        ? {
                              ...plantilla,
                              ...data,
                              updatedAt: new Date(),
                          }
                        : plantilla
                ),
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

    deletePlantilla: async (plantillaId) => {
        set({ loading: true, error: null });

        try {
            await deletePlantilla(plantillaId);

            set((state) => ({
                plantillas: state.plantillas.filter(
                    (plantilla) => plantilla.id !== plantillaId
                ),
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

    clearError: () => {
        set({ error: null });
    },

    reset: () => {
        set(initialState);
    },
}));