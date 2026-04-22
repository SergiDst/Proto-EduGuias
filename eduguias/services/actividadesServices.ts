import { COLECCIONES } from "@/constants/DocumentosColecciones";
import { db } from "@/lib/firestore";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

export interface Actividad {
    id: string;
    type: string;
    subject: string;
    title: string;
    score: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    payload?: Record<string, unknown>;
}

export interface CreateActividadInput {
    type: string;
    subject: string;
    title: string;
    score?: number;
    payload?: Record<string, unknown>;
}

export type UpdateActividadInput = Partial<CreateActividadInput>;

const usersCollection = COLECCIONES.USUARIOS;
const activitiesCollection = COLECCIONES.MIS_ACTIVIDADES;

const toDate = (value: unknown): Date | null => {
    if (value instanceof Timestamp) {
        return value.toDate();
    }

    if (value instanceof Date) {
        return value;
    }

    return null;
};

const mapActividad = (
    id: string,
    data: Record<string, unknown>
): Actividad => ({
    id,
    type: typeof data.type === "string" ? data.type : "",
    subject: typeof data.subject === "string" ? data.subject : "",
    title: typeof data.title === "string" ? data.title : "",
    score: typeof data.score === "number" ? data.score : 0,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    payload:
        data.payload && typeof data.payload === "object"
            ? (data.payload as Record<string, unknown>)
            : undefined,
});

const getActivitiesCollectionRef = (uid: string) =>
    collection(db, usersCollection, uid, activitiesCollection);

export async function getActividadesByUser(uid: string): Promise<Actividad[]> {
    const ref = getActivitiesCollectionRef(uid);
    const q = query(ref, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((activityDoc) =>
        mapActividad(activityDoc.id, activityDoc.data() as Record<string, unknown>)
    );
}

export async function createActividadByUser(
    uid: string,
    data: CreateActividadInput
): Promise<Actividad> {
    const ref = getActivitiesCollectionRef(uid);
    const activityPayload = {
        type: data.type,
        subject: data.subject,
        title: data.title,
        score: data.score ?? 0,
        payload: data.payload ?? {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const newDoc = await addDoc(ref, activityPayload);

    return {
        id: newDoc.id,
        type: activityPayload.type,
        subject: activityPayload.subject,
        title: activityPayload.title,
        score: activityPayload.score,
        payload: activityPayload.payload,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export async function updateActividadByUser(
    uid: string,
    actividadId: string,
    data: UpdateActividadInput
): Promise<void> {
    const activityRef = doc(db, usersCollection, uid, activitiesCollection, actividadId);

    await updateDoc(activityRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteActividadByUser(
    uid: string,
    actividadId: string
): Promise<void> {
    const activityRef = doc(db, usersCollection, uid, activitiesCollection, actividadId);
    await deleteDoc(activityRef);
}

export async function getActividadById(
    uid: string,
    actividadId: string
): Promise<Actividad | null> {
    const activityRef = doc(db, usersCollection, uid, activitiesCollection, actividadId);
    const snapshot = await getDoc(activityRef);

    if (!snapshot.exists()) {
        return null;
    }

    return mapActividad(snapshot.id, snapshot.data() as Record<string, unknown>);
}