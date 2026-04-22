export const EDITOR_SECTION_CATALOG = {
    objetivo: "Objetivo",
    contenido: "Contenido",
    retroalimentacion: "Retroalimentacion",
    paleta: "Paleta de colores",
    evaluacion: "Evaluacion",
    descargar: "Descargar",
} as const;

export type EditorSectionId = keyof typeof EDITOR_SECTION_CATALOG;

type ActivityEditorConfig = {
    label: string;
    sections: EditorSectionId[];
};

export const EDITOR_ACTIVITY_CONFIG: Record<string, ActivityEditorConfig> = {
    cuestionario: {
        label: "Cuestionario",
        sections: ["objetivo", "contenido", "retroalimentacion", "paleta", "evaluacion", "descargar"],
    },
    "union-conceptos": {
        label: "Union de conceptos",
        sections: ["objetivo", "contenido", "retroalimentacion", "paleta", "evaluacion", "descargar"],
    },
    lectura: {
        label: "Lectura",
        sections: ["objetivo", "contenido", "retroalimentacion", "evaluacion", "descargar"],
    },
    "video-guia": {
        label: "Video guia",
        sections: ["objetivo", "contenido", "retroalimentacion", "evaluacion", "descargar"],
    },
    "verdadero-falso": {
        label: "Verdadero - Falso",
        sections: ["objetivo", "contenido", "retroalimentacion", "evaluacion", "descargar"],
    },
};

export function isValidTipoActividad(tipoActividad: string): boolean {
    return Boolean(EDITOR_ACTIVITY_CONFIG[tipoActividad]);
}

export function getActivityLabel(tipoActividad: string): string {
    return EDITOR_ACTIVITY_CONFIG[tipoActividad]?.label ?? "Actividad";
}

export function getSectionsByActivity(tipoActividad: string): Array<{ id: EditorSectionId; label: string }> {
    const sectionIds = EDITOR_ACTIVITY_CONFIG[tipoActividad]?.sections ?? [];

    return sectionIds.map((sectionId) => ({
        id: sectionId,
        label: EDITOR_SECTION_CATALOG[sectionId],
    }));
}

export function getDefaultSection(tipoActividad: string): EditorSectionId | null {
    const sections = EDITOR_ACTIVITY_CONFIG[tipoActividad]?.sections;
    return sections?.[0] ?? null;
}

export function isValidSectionForActivity(tipoActividad: string, seccion: string): boolean {
    const sections = EDITOR_ACTIVITY_CONFIG[tipoActividad]?.sections ?? [];
    return sections.includes(seccion as EditorSectionId);
}

export function isEditorRoute(pathname?: string | null): boolean {
    if (!pathname) {
        return false;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length < 3 || segments[0] !== "mis-actividades") {
        return false;
    }

    const tipoActividad = segments[1];
    const seccion = segments[2];

    return isValidTipoActividad(tipoActividad) && isValidSectionForActivity(tipoActividad, seccion);
}