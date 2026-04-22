'use client'

import { getDefaultSection, isValidTipoActividad } from "@/constants/editorRouting";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TipoActividadIndexPage() {
    const params = useParams<{ tipoActividad: string }>();
    const router = useRouter();
    const tipoActividad = params?.tipoActividad;

    useEffect(() => {
        if (!tipoActividad || !isValidTipoActividad(tipoActividad)) {
            router.replace("/mis-actividades");
            return;
        }

        const defaultSection = getDefaultSection(tipoActividad);
        if (!defaultSection) {
            router.replace("/mis-actividades");
            return;
        }

        router.replace(`/mis-actividades/${tipoActividad}/${defaultSection}`);
    }, [tipoActividad, router]);

    return null;
}