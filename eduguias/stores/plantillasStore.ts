import { create } from "zustand";
import { PlantillasStore } from "@/interfaces/plantillasStore";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import {
    createPlantilla,
    deletePlantilla,
    getPlantillas,
    updatePlantilla,
} from "@/services/plantillasServices";

const FETCH_COOLDOWN_MS = 800;
const fetchInFlight = new Map<string, Promise<void>>();
const fetchTimestamps = new Map<string, number>();
const createInFlight = new Map<string, Promise<Awaited<ReturnType<typeof createPlantilla>>>>();
const updateInFlight = new Map<string, Promise<void>>();
const deleteInFlight = new Map<string, Promise<void>>();

const initialState = {
    plantillas: [],
    loading: false,
    error: null as string | null,
    fetched: false,
};

export const usePlantillasStore = create<PlantillasStore>((set) => ({
    ...initialState,

    fetchPlantillas: async (limitNumber) => {
        const key = typeof limitNumber === "number" ? String(limitNumber) : "all";
        const now = Date.now();
        const lastFetch = fetchTimestamps.get(key) ?? 0;

        if (now - lastFetch < FETCH_COOLDOWN_MS) {
            return;
        }

        const existingRequest = fetchInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
        set({ loading: true, error: null });

        try {
            const plantillas = await getPlantillas(limitNumber);
            fetchTimestamps.set(key, Date.now());
            set({ plantillas, loading: false, fetched: true });
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        } finally {
            fetchInFlight.delete(key);
        }
        })();

        fetchInFlight.set(key, request);
        return request;
    },

    createPlantilla: async (data) => {
        const key = JSON.stringify(data);
        const existingRequest = createInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
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
        } finally {
            createInFlight.delete(key);
        }
        })();

        createInFlight.set(key, request);
        return request;
    },

    updatePlantilla: async (plantillaId, data) => {
        const key = plantillaId;
        const existingRequest = updateInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
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
        } finally {
            updateInFlight.delete(key);
        }
        })();

        updateInFlight.set(key, request);
        return request;
    },

    deletePlantilla: async (plantillaId) => {
        const key = plantillaId;
        const existingRequest = deleteInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
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
        } finally {
            deleteInFlight.delete(key);
        }
        })();

        deleteInFlight.set(key, request);
        return request;
    },

    clearError: () => {
        set({ error: null });
    },

    reset: () => {
        set(initialState);
    },
}));