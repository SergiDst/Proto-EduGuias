import { COLECCIONES } from "@/constants/DocumentosColecciones";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firestore";
import { createUserWithEmailAndPassword, onIdTokenChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const usersCollection = COLECCIONES.USUARIOS;

export function listenAuthState(callback: (user: User | null) => void) {
    return onIdTokenChanged(auth, callback);
}

export async function loginWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}

export async function logoutFirebase() {
    return signOut(auth);
}

export async function resetPasswordFirebase(email: string) {
    return sendPasswordResetEmail(auth, email);
}

export async function signupWithEmail(email: string, password: string) {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const ref = doc(db, usersCollection, credential.user.uid);
        const initialUserData = {
           Apodo: "",
           Correo: email,
           FotoPerfil: "",
        }
        await setDoc(ref, initialUserData, { merge: true });
        await sendEmailVerification(credential.user);
        return credential.user;
    } catch (error) {
        throw error;
    }
}