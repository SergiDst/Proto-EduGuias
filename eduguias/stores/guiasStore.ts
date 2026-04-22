import { create } from "zustand";
import { GuiasStore } from "@/interfaces/guiasStore";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import {
    createGuia,
    deleteGuia,
    getGuias,
    getGuiasByTipo,
    updateGuia,
} from "@/services/guiasServices";

const FETCH_COOLDOWN_MS = 800;
const fetchInFlight = new Map<string, Promise<void>>();
const fetchTimestamps = new Map<string, number>();
const createInFlight = new Map<string, Promise<Awaited<ReturnType<typeof createGuia>>>>();
const updateInFlight = new Map<string, Promise<void>>();
const deleteInFlight = new Map<string, Promise<void>>();

const initialState = {
    guias: [],
    loading: false,
    error: null as string | null,
    fetched: false,
};

export const useGuiasStore = create<GuiasStore>((set) => ({
    ...initialState,

    fetchGuias: async (limitNumber) => {
        const key = `all:${typeof limitNumber === "number" ? String(limitNumber) : "*"}`;
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
            const guias = await getGuias(limitNumber);
            fetchTimestamps.set(key, Date.now());
            set({ guias, loading: false, fetched: true });
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

    fetchGuiasByTipo: async (tipo, limitNumber) => {
        const key = `${tipo}:${typeof limitNumber === "number" ? String(limitNumber) : "*"}`;
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
            const guias = await getGuiasByTipo(tipo, limitNumber);
            fetchTimestamps.set(key, Date.now());
            set({ guias, loading: false, fetched: true });
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

    createGuia: async (data) => {
        const key = JSON.stringify(data);
        const existingRequest = createInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
        set({ loading: true, error: null });

        try {
            const nuevaGuia = await createGuia(data);

            set((state) => ({
                guias: [nuevaGuia, ...state.guias],
                loading: false,
                fetched: true,
            }));

            return nuevaGuia;
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

    updateGuia: async (guiaId, data) => {
        const key = guiaId;
        const existingRequest = updateInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
        set({ loading: true, error: null });

        try {
            await updateGuia(guiaId, data);

            set((state) => ({
                guias: state.guias.map((guia) =>
                    guia.id === guiaId
                        ? {
                              ...guia,
                              ...data,
                              updatedAt: new Date(),
                          }
                        : guia
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

    deleteGuia: async (guiaId) => {
        const key = guiaId;
        const existingRequest = deleteInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
        set({ loading: true, error: null });

        try {
            await deleteGuia(guiaId);

            set((state) => ({
                guias: state.guias.filter((guia) => guia.id !== guiaId),
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