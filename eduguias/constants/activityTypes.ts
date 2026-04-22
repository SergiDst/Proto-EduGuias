const EDITOR_TYPE_MAP: Record<string, string> = {
    cuestionario: "cuestionario",
    "union de conceptos": "union-conceptos",
    "union-conceptos": "union-conceptos",
    lectura: "lectura",
    "video guia": "video-guia",
    "video-guia": "video-guia",
    "verdadero falso": "verdadero-falso",
    "verdadero - falso": "verdadero-falso",
    "verdadero-falso": "verdadero-falso",
};

const DISPLAY_TYPE_MAP: Record<string, string> = {
    cuestionario: "Cuestionario",
    "union-conceptos": "Union de conceptos",
    lectura: "Lectura",
    "video-guia": "Video guia",
    "verdadero-falso": "Verdadero - Falso",
};

export function normalizeActivityType(value: string): string {
    return value.trim().toLowerCase();
}

export function toEditorActivityType(value: string): string {
    const normalized = normalizeActivityType(value);
    return EDITOR_TYPE_MAP[normalized] ?? normalized;
}

export function toDisplayActivityType(value: string): string {
    const editorType = toEditorActivityType(value);
    return DISPLAY_TYPE_MAP[editorType] ?? value;
}