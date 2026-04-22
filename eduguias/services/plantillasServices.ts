import { COLECCIONES } from "@/constants/DocumentosColecciones";
import { db } from "@/lib/firestore";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";

export interface Plantilla {
    id: string;
    title: string;
    description: string;
    category: string;
    activityType: string;
    downloadUrl?: string;
    previewUrl?: string;
    content?: Record<string, unknown>;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface CreatePlantillaInput {
    title: string;
    description: string;
    category: string;
    activityType: string;
    downloadUrl?: string;
    previewUrl?: string;
    content?: Record<string, unknown>;
}

export type UpdatePlantillaInput = Partial<CreatePlantillaInput>;

const templatesCollection = COLECCIONES.PLANTILLAS;

const toDate = (value: unknown): Date | null => {
    if (value instanceof Timestamp) {
        return value.toDate();
    }

    if (value instanceof Date) {
        return value;
    }

    return null;
};

const mapPlantilla = (id: string, data: Record<string, unknown>): Plantilla => ({
    id,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    category: typeof data.category === "string" ? data.category : "",
    activityType: typeof data.activityType === "string" ? data.activityType : "",
    downloadUrl: typeof data.downloadUrl === "string" ? data.downloadUrl : undefined,
    previewUrl: typeof data.previewUrl === "string" ? data.previewUrl : undefined,
    content:
        data.content && typeof data.content === "object"
            ? (data.content as Record<string, unknown>)
            : undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
});

export async function getPlantillas(limitNumber?: number): Promise<Plantilla[]> {
    const ref = collection(db, templatesCollection);
    const q =
        typeof limitNumber === "number"
            ? query(ref, orderBy("updatedAt", "desc"), limit(limitNumber))
            : query(ref, orderBy("updatedAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((templateDoc) =>
        mapPlantilla(templateDoc.id, templateDoc.data() as Record<string, unknown>)
    );
}

export async function createPlantilla(
    data: CreatePlantillaInput
): Promise<Plantilla> {
    const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        activityType: data.activityType,
        downloadUrl: data.downloadUrl ?? "",
        previewUrl: data.previewUrl ?? "",
        content: data.content ?? {},
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const ref = collection(db, templatesCollection);
    const createdDoc = await addDoc(ref, payload);

    return {
        id: createdDoc.id,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        activityType: payload.activityType,
        downloadUrl: payload.downloadUrl || undefined,
        previewUrl: payload.previewUrl || undefined,
        content: payload.content,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export async function updatePlantilla(
    plantillaId: string,
    data: UpdatePlantillaInput
): Promise<void> {
    const ref = doc(db, templatesCollection, plantillaId);

    await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deletePlantilla(plantillaId: string): Promise<void> {
    const ref = doc(db, templatesCollection, plantillaId);
    await deleteDoc(ref);
}