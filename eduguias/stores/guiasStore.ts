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

const initialState = {
    guias: [],
    loading: false,
    error: null as string | null,
    fetched: false,
};

export const useGuiasStore = create<GuiasStore>((set) => ({
    ...initialState,

    fetchGuias: async (limitNumber) => {
        set({ loading: true, error: null });

        try {
            const guias = await getGuias(limitNumber);
            set({ guias, loading: false, fetched: true });
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    fetchGuiasByTipo: async (tipo, limitNumber) => {
        set({ loading: true, error: null });

        try {
            const guias = await getGuiasByTipo(tipo, limitNumber);
            set({ guias, loading: false, fetched: true });
        } catch (error) {
            set({
                loading: false,
                error: getFirebaseErrorMessage(error),
            });
            throw error;
        }
    },

    createGuia: async (data) => {
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
        }
    },

    updateGuia: async (guiaId, data) => {
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
        }
    },

    deleteGuia: async (guiaId) => {
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
        }
    },

    clearError: () => {
        set({ error: null });
    },

    reset: () => {
        set(initialState);
    },
}));