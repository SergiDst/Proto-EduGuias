import { create } from "zustand";
import { ActividadesStore } from "@/interfaces/actividadesStore";
import type { CuestionarioPayload } from "@/interfaces/actividades";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import {
    createActividadByUser,
    deleteActividadByUser,
    getActividadById,
    getActividadesByUser,
    updateActividadByUser,
} from "@/services/actividadesServices";

const FETCH_COOLDOWN_MS = 800;
const userFetchInFlight = new Map<string, Promise<void>>();
const userFetchTimestamps = new Map<string, number>();
const byIdFetchInFlight = new Map<string, Promise<Awaited<ReturnType<typeof getActividadById>>>>();
const byIdFetchTimestamps = new Map<string, number>();
const createInFlight = new Map<string, Promise<Awaited<ReturnType<typeof createActividadByUser>>>>();
const updateInFlight = new Map<string, Promise<void>>();
const deleteInFlight = new Map<string, Promise<void>>();

const initialState = {
    actividades: [],
    selectedActividad: null,
    questionnaireDraft: null,
    loading: false,
    error: null as string | null,
    fetched: false,
};

export const useActividadesStore = create<ActividadesStore>((set, get) => ({
    ...initialState,

    fetchActividadesByUser: async (uid) => {
        const now = Date.now();
        const lastFetch = userFetchTimestamps.get(uid) ?? 0;

        if (now - lastFetch < FETCH_COOLDOWN_MS) {
            return;
        }

        const existingRequest = userFetchInFlight.get(uid);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
        set({ loading: true, error: null });

        try {
            const actividades = await getActividadesByUser(uid);
            userFetchTimestamps.set(uid, Date.now());
            set({ actividades, loading: false, fetched: true });
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        } finally {
            userFetchInFlight.delete(uid);
        }
        })();

        userFetchInFlight.set(uid, request);
        return request;
    },

    fetchActividadById: async (uid, actividadId) => {
        const key = `${uid}:${actividadId}`;
        const now = Date.now();
        const lastFetch = byIdFetchTimestamps.get(key) ?? 0;
        const selectedActividad = get().selectedActividad;

        if (
            now - lastFetch < FETCH_COOLDOWN_MS &&
            selectedActividad?.id === actividadId
        ) {
            return selectedActividad;
        }

        const existingRequest = byIdFetchInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
        set({ loading: true, error: null });

        try {
            const actividad = await getActividadById(uid, actividadId);
            byIdFetchTimestamps.set(key, Date.now());
            set({
                selectedActividad: actividad,
                questionnaireDraft:
                    actividad?.type === "cuestionario" && actividad.payload
                        ? (actividad.payload as CuestionarioPayload)
                        : null,
                loading: false,
            });
            return actividad;
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        } finally {
            byIdFetchInFlight.delete(key);
        }
        })();

        byIdFetchInFlight.set(key, request);
        return request;
    },

    createActividad: async (uid, data) => {
        const key = `${uid}:${JSON.stringify(data)}`;
        const existingRequest = createInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
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
        } finally {
            createInFlight.delete(key);
        }
        })();

        createInFlight.set(key, request);
        return request;
    },

    updateActividad: async (uid, actividadId, data) => {
        const key = `${uid}:${actividadId}`;
        const existingRequest = updateInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
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
        } finally {
            updateInFlight.delete(key);
        }
        })();

        updateInFlight.set(key, request);
        return request;
    },

    setQuestionnaireDraft: (payload: CuestionarioPayload) => {
        set((state) => {
            const updatedActividad =
                state.selectedActividad?.type === "cuestionario"
                    ? {
                          ...state.selectedActividad,
                          payload,
                      }
                    : state.selectedActividad;

            return {
                questionnaireDraft: payload,
                selectedActividad: updatedActividad,
                actividades: state.actividades.map((actividad) =>
                    actividad.id === updatedActividad?.id
                        ? {
                              ...actividad,
                              payload,
                          }
                        : actividad
                ),
            };
        });
    },

    updateSelectedActividadPayload: (payload: CuestionarioPayload) => {
        get().setQuestionnaireDraft(payload);
    },

    deleteActividad: async (uid, actividadId) => {
        const key = `${uid}:${actividadId}`;
        const existingRequest = deleteInFlight.get(key);
        if (existingRequest) {
            return existingRequest;
        }

        const request = (async () => {
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
        } finally {
            deleteInFlight.delete(key);
        }
        })();

        deleteInFlight.set(key, request);
        return request;
    },

    clearSelectedActividad: () => {
        set({ selectedActividad: null, questionnaireDraft: null });
    },

    clearQuestionnaireDraft: () => {
        set({ questionnaireDraft: null });
    },

    clearError: () => {
        set({ error: null });
    },

    reset: () => {
        set(initialState);
    },
}));