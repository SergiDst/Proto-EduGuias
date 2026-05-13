import { create } from "zustand";
import {
    getUserProfile,
    updateUserProfile,
    UserProfile,
} from "@/services/userProfileServices";

interface UserProfileStore {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    fetchProfile: (uid: string) => Promise<void>;
    saveProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
    setLanguage: (lang: "es" | "en") => void;
    reset: () => void;
}

export const useUserProfileStore = create<UserProfileStore>((set, get) => ({
    profile: null,
    loading: false,
    error: null,

    fetchProfile: async (uid: string) => {
        set({ loading: true, error: null });
        try {
            const profile = await getUserProfile(uid);
            set({ profile, loading: false });
        } catch (e) {
            set({ loading: false, error: e instanceof Error ? e.message : "Error al cargar perfil" });
        }
    },

    saveProfile: async (uid: string, data: Partial<UserProfile>) => {
        set({ loading: true, error: null });
        try {
            await updateUserProfile(uid, data);
            const merged = { ...(get().profile ?? { Apodo: "", ProfileIcon: 0, Idioma: "es" as const }), ...data };
            set({ profile: merged, loading: false });
        } catch (e) {
            set({ loading: false, error: e instanceof Error ? e.message : "Error al guardar perfil" });
            throw e;
        }
    },

    setLanguage: (lang) => {
        set((state) => ({
            profile: state.profile
                ? { ...state.profile, Idioma: lang }
                : { Apodo: "", ProfileIcon: 0, Idioma: lang },
        }));
    },

    reset: () => set({ profile: null, loading: false, error: null }),
}));
