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
    where,
} from "firebase/firestore";

export type GuiaTipo = "plataforma" | "recurso-oficial";
export type GuiaAction = "download" | "link";

export interface Guia {
    id: string;
    title: string;
    description: string;
    tipo: GuiaTipo;
    action: GuiaAction;
    url: string;
    meta?: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface CreateGuiaInput {
    title: string;
    description: string;
    tipo: GuiaTipo;
    action: GuiaAction;
    url: string;
    meta?: string;
}

export type UpdateGuiaInput = Partial<CreateGuiaInput>;

const guidesCollection = COLECCIONES.GUIAS;

const toDate = (value: unknown): Date | null => {
    if (value instanceof Timestamp) {
        return value.toDate();
    }

    if (value instanceof Date) {
        return value;
    }

    return null;
};

const mapGuia = (id: string, data: Record<string, unknown>): Guia => ({
    id,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    tipo:
        data.tipo === "plataforma" || data.tipo === "recurso-oficial"
            ? data.tipo
            : "recurso-oficial",
    action: data.action === "download" ? "download" : "link",
    url: typeof data.url === "string" ? data.url : "",
    meta: typeof data.meta === "string" ? data.meta : undefined,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
});

export async function getGuias(limitNumber?: number): Promise<Guia[]> {
    const ref = collection(db, guidesCollection);
    const q =
        typeof limitNumber === "number"
            ? query(ref, orderBy("updatedAt", "desc"), limit(limitNumber))
            : query(ref, orderBy("updatedAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((guideDoc) =>
        mapGuia(guideDoc.id, guideDoc.data() as Record<string, unknown>)
    );
}

export async function getGuiasByTipo(
    tipo: GuiaTipo,
    limitNumber?: number
): Promise<Guia[]> {
    const ref = collection(db, guidesCollection);
    const q =
        typeof limitNumber === "number"
            ? query(
                  ref,
                  where("tipo", "==", tipo),
                  orderBy("updatedAt", "desc"),
                  limit(limitNumber)
              )
            : query(ref, where("tipo", "==", tipo), orderBy("updatedAt", "desc"));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((guideDoc) =>
        mapGuia(guideDoc.id, guideDoc.data() as Record<string, unknown>)
    );
}

export async function createGuia(data: CreateGuiaInput): Promise<Guia> {
    const payload = {
        title: data.title,
        description: data.description,
        tipo: data.tipo,
        action: data.action,
        url: data.url,
        meta: data.meta ?? "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };

    const ref = collection(db, guidesCollection);
    const createdDoc = await addDoc(ref, payload);

    return {
        id: createdDoc.id,
        title: payload.title,
        description: payload.description,
        tipo: payload.tipo,
        action: payload.action,
        url: payload.url,
        meta: payload.meta || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

export async function updateGuia(
    guiaId: string,
    data: UpdateGuiaInput
): Promise<void> {
    const ref = doc(db, guidesCollection, guiaId);

    await updateDoc(ref, {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteGuia(guiaId: string): Promise<void> {
    const ref = doc(db, guidesCollection, guiaId);
    await deleteDoc(ref);
}