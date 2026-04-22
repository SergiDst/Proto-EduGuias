'use client'

import { ContenidoStep } from "@/components/ContenidoPage";
import { DescargaStep } from "@/components/DescargaPage";
import { EvaluacionStep } from "@/components/EvaluacionPage";
import { ObjetivoStep } from "../../../../../../components/ObjetivoPage";
import { RetroalimentacionStep } from "@/components/RetroalimentacionPage";
import { ColoresStep } from "../../../../../../components/ColoresPage";
import {
    EDITOR_SECTION_CATALOG,
    getActivityLabel,
    getSectionsByActivity,
    isValidSectionForActivity,
    isValidTipoActividad,
} from "@/constants/editorRouting";
import { useAuthStore } from "@/stores/authStore";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const REQUIRED_SECTIONS = new Set(["objetivo", "contenido", "retroalimentacion", "paleta"]);

export default function EditorSeccionPage() {
    const params = useParams<{ tipoActividad: string; seccion: string }>();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tipoActividad = params?.tipoActividad;
    const seccion = params?.seccion;
    const actividadId = searchParams.get("actividadId");
    const user = useAuthStore((state) => state.user);
    const fetchActividadById = useActividadesStore((state) => state.fetchActividadById);
    const completion = useUiStore((state) => state.editorSectionCompletion);
    const sections = useMemo(
        () => (tipoActividad ? getSectionsByActivity(tipoActividad) : []),
        [tipoActividad]
    );
    const currentSectionIndex = sections.findIndex((item) => item.id === seccion);

    useEffect(() => {
        if (!tipoActividad || !seccion || currentSectionIndex <= 0) {
            return;
        }

        const firstLockedIndex = sections.findIndex((item, index) =>
            index < currentSectionIndex && REQUIRED_SECTIONS.has(item.id) && !completion[item.id]
        );

        if (firstLockedIndex >= 0) {
            const lockedSection = sections[firstLockedIndex];
            router.replace(`/mis-actividades/${tipoActividad}/${lockedSection.id}`);
        }
    }, [completion, currentSectionIndex, router, sections, seccion, tipoActividad]);

    useEffect(() => {
        if (!actividadId || !user?.uid) {
            return;
        }

        fetchActividadById(user.uid, actividadId).catch(() => undefined);
    }, [actividadId, user?.uid, fetchActividadById]);

    if (!tipoActividad || !seccion || !isValidTipoActividad(tipoActividad)) {
        return <div>Tipo de actividad no reconocido</div>;
    }

    if (!isValidSectionForActivity(tipoActividad, seccion)) {
        return <div>Seccion no disponible para esta actividad</div>;
    }

    const nombreActividad = getActivityLabel(tipoActividad);
    const nombreSeccion = EDITOR_SECTION_CATALOG[seccion as keyof typeof EDITOR_SECTION_CATALOG];

    const navigateToSection = (index: number) => {
        const target = sections[index];
        if (!target) {
            return;
        }

        router.push(`/mis-actividades/${tipoActividad}/${target.id}`);
    };

    const handleNext = () => {
        if (currentSectionIndex >= 0 && currentSectionIndex < sections.length - 1) {
            navigateToSection(currentSectionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentSectionIndex > 0) {
            navigateToSection(currentSectionIndex - 1);
        }
    };

    if (tipoActividad === "cuestionario") {
        switch (seccion) {
            case "objetivo":
                return (
                    <div className="p-8">
                        <ObjetivoStep onNext={handleNext} />
                    </div>
                );
            case "contenido":
                return (
                    <div className="p-8">
                        <ContenidoStep onNext={handleNext} onPrev={handlePrev} />
                    </div>
                );
            case "retroalimentacion":
                return (
                    <div className="p-8">
                        <RetroalimentacionStep onNext={handleNext} onPrev={handlePrev} />
                    </div>
                );
            case "paleta":
                return (
                    <div className="p-8">
                        <ColoresStep onNext={handleNext} onPrev={handlePrev} />
                    </div>
                );
            case "evaluacion":
                return (
                    <div className="p-8">
                        <EvaluacionStep onNext={handleNext} onPrev={handlePrev} />
                    </div>
                );
            case "descargar":
                return (
                    <DescargaStep
                        onDownloadHtml={() => {
                            // TODO: Replace with real HTML export logic.
                            console.log("Descargar HTML");
                        }}
                        onDownloadScorm={() => {
                            // TODO: Replace with real SCORM export logic.
                            console.log("Descargar SCORM");
                        }}
                    />
                );
            default:
                break;
        }
    }

    return (
        <div className="p-8">
            <h1 className="font-[Lexend] text-2xl font-bold text-[#0F172A]">{nombreActividad}</h1>
            <p className="font-[Lexend] text-sm text-[#475569] mt-1">Seccion: {nombreSeccion}</p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
                <p className="font-[Lexend] text-base text-[#0F172A]">
                    Aqui renderiza el editor de <strong>{nombreActividad}</strong> para la seccion <strong>{nombreSeccion}</strong>.
                </p>
            </div>
        </div>
    );
}