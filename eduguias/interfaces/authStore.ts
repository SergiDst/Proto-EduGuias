import { User } from "firebase/auth";

export interface AuthStore {
    user: User | null;
    authReady: boolean;
    initAuthListener: () => () => void;
    setSessionPersistence: (remember: boolean) => Promise<void>;
    login: (email: string, password: string) => Promise<User | void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    reset: () => void;
}
