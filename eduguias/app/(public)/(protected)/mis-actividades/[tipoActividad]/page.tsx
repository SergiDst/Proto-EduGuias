'use client'

import { getDefaultSection, isValidTipoActividad } from "@/constants/editorRouting";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function TipoActividadIndexPage() {
    const params = useParams<{ tipoActividad: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tipoActividad = params?.tipoActividad;
    const actividadId = searchParams.get("actividadId");

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

        const query = actividadId ? `?actividadId=${actividadId}` : "";
        router.replace(`/mis-actividades/${tipoActividad}/${defaultSection}${query}`);
    }, [tipoActividad, actividadId, router]);

    return null;
}