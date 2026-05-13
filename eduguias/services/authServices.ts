import { COLECCIONES } from "@/constants/DocumentosColecciones";
import { auth } from "@/lib/auth";
import { db } from "@/lib/firestore";
import {
    createUserWithEmailAndPassword,
    EmailAuthProvider,
    onIdTokenChanged,
    reauthenticateWithCredential,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updateEmail,
    updatePassword,
    User,
} from "firebase/auth";
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

async function reauthenticateCurrentUser(user: User, currentPassword: string) {
    if (!user.email) {
        throw new Error("La cuenta no tiene un correo asociado.");
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
}

export async function updateUserEmail(currentPassword: string, newEmail: string) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No hay un usuario autenticado.");
    }
    await reauthenticateCurrentUser(user, currentPassword);
    await updateEmail(user, newEmail);
    await sendEmailVerification(user);
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("No hay un usuario autenticado.");
    }
    await reauthenticateCurrentUser(user, currentPassword);
    await updatePassword(user, newPassword);
}

export async function signupWithEmail(email: string, password: string) {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const ref = doc(db, usersCollection, credential.user.uid);
        const initialUserData = {
           Apodo: "",
           ProfileIcon: 0,
           //Agregar despues objetos u arrays vacios para actividades del usuario
        }
        await setDoc(ref, initialUserData, { merge: true });
        await sendEmailVerification(credential.user);
        return credential.user;
    } catch (error) {
        throw error;
    }
}