import { COLECCIONES } from "@/constants/DocumentosColecciones";
import { db } from "@/lib/firestore";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const usersCollection = COLECCIONES.USUARIOS;

export interface UserProfile {
    Apodo: string;
    ProfileIcon: number;
    Idioma?: "es" | "en";
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const ref = doc(db, usersCollection, uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        return null;
    }
    const data = snap.data();
    return {
        Apodo: typeof data.Apodo === "string" ? data.Apodo : "",
        ProfileIcon: typeof data.ProfileIcon === "number" ? data.ProfileIcon : 0,
        Idioma: data.Idioma === "en" ? "en" : "es",
    };
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    const ref = doc(db, usersCollection, uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        await updateDoc(ref, data as Record<string, unknown>);
    } else {
        await setDoc(ref, {
            Apodo: data.Apodo ?? "",
            ProfileIcon: data.ProfileIcon ?? 0,
            Idioma: data.Idioma ?? "es",
            ...data,
        });
    }
}
