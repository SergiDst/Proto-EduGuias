import { create } from "zustand";
import { browserLocalPersistence, browserSessionPersistence, reload, setPersistence } from "firebase/auth";
import { AuthStore } from "@/interfaces/authStore";
import { getFirebaseErrorMessage } from "@/utils/firebaseErrors";
import { auth } from "@/lib/auth";
import { listenAuthState, loginWithEmail, logoutFirebase, resetPasswordFirebase, signupWithEmail } from "@/services/authServices";

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    authReady: false,

    initAuthListener: () => {
        const unsubscribe = listenAuthState((user) => {
            set({ user, authReady: true });
        });

        return unsubscribe;
    },

    setSessionPersistence: async (remember) => {
        try {
            await setPersistence(
                auth,
                remember ? browserLocalPersistence : browserSessionPersistence
            );
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error);
            throw new Error(errorMessage);
        }
    },

    login: async (email, password) => {
        if (!email || !password) return;
        try {
            const credential = await loginWithEmail(email, password);
            await reload(credential.user);
            return credential.user;
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error);
            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        try {
            await logoutFirebase();
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error);
            throw new Error(errorMessage);
        }
    },

    resetPassword: async (email) => {
        try {
            await resetPasswordFirebase(email);
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error);
            throw new Error(errorMessage);
        }
    },

    signUp: async (email, password) => {
        try {
            await signupWithEmail(email, password);
        } catch (error) {
            const errorMessage = getFirebaseErrorMessage(error);
            throw new Error(errorMessage);
        }
    },

    reset: () => {
        set({ user: null, authReady: false });
    },
}));
