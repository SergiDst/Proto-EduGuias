import type { CuestionarioPayload } from "@/interfaces/actividades";
import type { Microtip, MicrotipType } from "@/interfaces/uiStore";
import type { EditorSectionId } from "@/constants/editorRouting";

export interface MicrotipSuggestion {
    type: MicrotipType;
    title: string;
    body: string;
    section: EditorSectionId;
}

// --- Color contrast helpers (WCAG 1.4.3) ---
function hexToRgb(hex: string): [number, number, number] | null {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return null;
    return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16),
    ];
}

function relativeLuminance(r: number, g: number, b: number): number {
    const sRGB = [r, g, b].map((c) => {
        const s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(hex1: string, hex2: string): number | null {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return null;
    const l1 = relativeLuminance(...rgb1);
    const l2 = relativeLuminance(...rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

// --- Text readability helpers (UDL) ---
function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function avgSentenceLength(text: string): number {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    if (sentences.length === 0) return 0;
    const totalWords = sentences.reduce((sum, s) => sum + countWords(s), 0);
    return totalWords / sentences.length;
}

// --- Analysis functions per section ---

export function analyzeObjetivo(payload: Partial<CuestionarioPayload>): MicrotipSuggestion[] {
    const tips: MicrotipSuggestion[] = [];
    const objective = payload.objective ?? "";

    if (objective.trim().length > 20) {
        // UDL: check sentence complexity
        const avgLen = avgSentenceLength(objective);
        if (avgLen > 20) {
            tips.push({
                type: "UDL",
                title: "Objetivo muy complejo",
                body: "Las oraciones de tu objetivo son largas (promedio " + Math.round(avgLen) + " palabras). UDL recomienda oraciones cortas (máx. 15 palabras) para mejorar la comprensión y accesibilidad cognitiva.",
                section: "objetivo",
            });
        }

        // UDL: objective should mention the learner
        const hasLearnerReference = /estudiante|alumno|aprenderá|identificar|comprender|analizar|evaluar|aplicar|demostrar/i.test(objective);
        if (!hasLearnerReference) {
            tips.push({
                type: "UDL",
                title: "Objetivo sin verbo de acción",
                body: "Un buen objetivo de aprendizaje incluye un verbo observable (ej: 'identificar', 'analizar', 'aplicar'). Esto ayuda al estudiante a entender qué se espera de él.",
                section: "objetivo",
            });
        }

        // Clarity: check if too long overall
        if (objective.trim().length > 400) {
            tips.push({
                type: "Clarity",
                title: "Objetivo demasiado extenso",
                body: "Tu objetivo supera los 400 caracteres. Los objetivos efectivos son concisos (UDL recomienda máx. 200 caracteres) para que el estudiante lo recuerde fácilmente.",
                section: "objetivo",
            });
        }
    }

    return tips;
}

export function analyzeContenido(payload: Partial<CuestionarioPayload>): MicrotipSuggestion[] {
    const tips: MicrotipSuggestion[] = [];
    const questions = payload.questions ?? [];

    if (questions.length === 0) return tips;

    // UDL: check question length
    for (const question of questions) {
        if (question.title.trim().length > 250) {
            tips.push({
                type: "UDL",
                title: "Pregunta demasiado larga",
                body: `Una pregunta supera los 250 caracteres. UDL sugiere preguntas claras y concisas (máx. 150 caracteres) para reducir la carga cognitiva del estudiante.`,
                section: "contenido",
            });
            break;
        }
    }

    // WCAG: images without alt text
    const imagesWithoutAlt = questions.filter(
        (q) => q.imageUrl && q.imageUrl.trim().length > 0 && (!q.imageAlt || q.imageAlt.trim().length === 0)
    );
    if (imagesWithoutAlt.length > 0) {
        tips.push({
            type: "WCAG",
            title: "Imágenes sin texto alternativo",
            body: `${imagesWithoutAlt.length} pregunta(s) tienen imagen pero no tienen texto alternativo (alt). WCAG 1.1.1 requiere descripciones alt para que lectores de pantalla puedan interpretar el contenido visual.`,
            section: "contenido",
        });
    }

    // UDL: options too similar length (could indicate confusing distractors)
    for (const question of questions) {
        const emptyOptions = question.options.filter((o) => o.label.trim().length === 0);
        if (emptyOptions.length > 0 && question.options.length > 0) {
            tips.push({
                type: "Clarity",
                title: "Opciones de respuesta vacías",
                body: "Algunas opciones de respuesta están vacías. Los estudiantes con necesidades especiales pueden confundirse con opciones incompletas. Completa o elimina las opciones vacías.",
                section: "contenido",
            });
            break;
        }
    }

    // UDL: very few questions
    if (questions.length === 1) {
        tips.push({
            type: "UDL",
            title: "Actividad con una sola pregunta",
            body: "Una actividad con múltiples preguntas ofrece más oportunidades de representación y comprensión. UDL recomienda al menos 3 preguntas para una evaluación significativa.",
            section: "contenido",
        });
    }

    return tips;
}

export function analyzeRetroalimentacion(payload: Partial<CuestionarioPayload>): MicrotipSuggestion[] {
    const tips: MicrotipSuggestion[] = [];
    const message = payload.generalMessage ?? "";

    if (message.trim().length > 10) {
        if (message.trim().length > 400) {
            tips.push({
                type: "UDL",
                title: "Mensaje de cierre muy largo",
                body: "El mensaje general supera los 400 caracteres. UDL recomienda retroalimentación breve y motivadora al finalizar (máx. 200 caracteres) para no abrumar al estudiante.",
                section: "retroalimentacion",
            });
        }

        // Check if it contains encouragement
        const hasEncouragement = /bien|excelente|correcto|lograste|aprendiste|felici|éxito|bravo|continúa|sigue/i.test(message);
        if (!hasEncouragement) {
            tips.push({
                type: "UDL",
                title: "Mensaje poco motivador",
                body: "El mensaje de cierre no contiene palabras de aliento. UDL (Principio de Compromiso) recomienda incluir retroalimentación motivadora para reforzar la autoeficacia del estudiante.",
                section: "retroalimentacion",
            });
        }
    }

    return tips;
}

export function analyzePaleta(payload: Partial<CuestionarioPayload>): MicrotipSuggestion[] {
    const tips: MicrotipSuggestion[] = [];
    const palette = payload.palette;
    if (!palette) return tips;

    // WCAG 1.4.3: Contrast ratio minimum 4.5:1 for normal text
    const ratio = contrastRatio(palette.textColor, palette.backgroundColor);
    if (ratio !== null && ratio < 4.5) {
        tips.push({
            type: "WCAG",
            title: `Contraste insuficiente (${ratio.toFixed(1)}:1)`,
            body: `La combinación de color de texto y fondo tiene una relación de contraste de ${ratio.toFixed(1)}:1. WCAG 2.1 AA requiere mínimo 4.5:1 para texto normal. Ajusta los colores para mejorar la legibilidad.`,
            section: "paleta",
        });
    }

    // WCAG: font size too small for body text
    if (palette.bodySize < 14) {
        tips.push({
            type: "WCAG",
            title: "Texto del cuerpo muy pequeño",
            body: `El tamaño del cuerpo es ${palette.bodySize}px. WCAG recomienda mínimo 14px para garantizar legibilidad en pantallas de baja resolución y para usuarios con baja visión.`,
            section: "paleta",
        });
    }

    // UDL: very large title vs body ratio
    if (palette.titleSize > 0 && palette.bodySize > 0) {
        const ratio = palette.titleSize / palette.bodySize;
        if (ratio > 2.5) {
            tips.push({
                type: "Clarity",
                title: "Jerarquía tipográfica muy pronunciada",
                body: `La diferencia entre el tamaño del título (${palette.titleSize}px) y el cuerpo (${palette.bodySize}px) es grande. Esto puede dificultar la lectura fluida para estudiantes con dislexia.`,
                section: "paleta",
            });
        }
    }

    return tips;
}

export function analyzeAll(payload: Partial<CuestionarioPayload>): MicrotipSuggestion[] {
    return [
        ...analyzeObjetivo(payload),
        ...analyzeContenido(payload),
        ...analyzeRetroalimentacion(payload),
        ...analyzePaleta(payload),
    ];
}

// Scoring for EvaluacionPage
export interface AccessibilityScore {
    pedagogicalScore: number;
    wcagScore: number;
    udlItems: Array<{ title: string; status: "ok" | "warning" }>;
    wcagItems: Array<{ title: string; status: "ok" | "error"; meta: string }>;
    problems: Array<{
        tag: string;
        title: string;
        description: string;
        tone: "error" | "warning" | "info";
        section: EditorSectionId;
    }>;
}

export function computeAccessibilityScore(payload: Partial<CuestionarioPayload>): AccessibilityScore {
    const allTips = analyzeAll(payload);
    const wcagTips = allTips.filter((t) => t.type === "WCAG");
    const udlTips = allTips.filter((t) => t.type === "UDL");
    const clarityTips = allTips.filter((t) => t.type === "Clarity");

    // Check specific criteria
    const palette = payload.palette;
    const hasContrastIssue = wcagTips.some((t) => t.title.includes("Contraste"));
    const hasAltTextIssue = wcagTips.some((t) => t.title.includes("alt"));
    const hasFontSizeIssue = wcagTips.some((t) => t.title.includes("pequeño"));

    const hasMultipleRepresentations = (payload.questions ?? []).some((q) => q.imageUrl && q.imageUrl.trim().length > 0);
    const hasActionVerb = /identificar|comprender|analizar|evaluar|aplicar|demostrar/i.test(payload.objective ?? "");
    const hasEngagement = /bien|excelente|bravo|lograste|felici/i.test(payload.generalMessage ?? "");

    const udlItems: AccessibilityScore["udlItems"] = [
        {
            title: "Múltiples medios de representación",
            status: hasMultipleRepresentations ? "ok" : "warning",
        },
        {
            title: "Acción y Expresión",
            status: hasActionVerb ? "ok" : "warning",
        },
        {
            title: "Compromiso y motivación",
            status: hasEngagement ? "ok" : "warning",
        },
    ];

    const wcagItems: AccessibilityScore["wcagItems"] = [
        {
            title: "Contraste",
            status: hasContrastIssue ? "error" : "ok",
            meta: hasContrastIssue ? "Necesita ajuste" : "Cumple AA",
        },
        {
            title: "Texto alternativo",
            status: hasAltTextIssue ? "error" : "ok",
            meta: hasAltTextIssue ? "Falta alt" : "Correcto",
        },
        {
            title: "Tamaño de texto",
            status: hasFontSizeIssue ? "error" : "ok",
            meta: hasFontSizeIssue ? "Muy pequeño" : "Adecuado",
        },
        {
            title: "Estructura",
            status: "ok",
            meta: "Correcto",
        },
    ];

    // Compute scores
    const udlOk = udlItems.filter((i) => i.status === "ok").length;
    const wcagOk = wcagItems.filter((i) => i.status === "ok").length;

    const udlScore = Math.round((udlOk / udlItems.length) * 100);
    const wcagScore = Math.round((wcagOk / wcagItems.length) * 100);

    // Combine clarity penalties
    const clarityPenalty = Math.min(clarityTips.length * 5, 20);
    const pedagogicalScore = Math.max(udlScore - clarityPenalty, 0);

    const problems = allTips.map((tip) => ({
        tag: tip.type === "WCAG" ? "WCAG 2.1" : tip.type === "UDL" ? "UDL Principle" : "Clarity",
        title: tip.title,
        description: tip.body,
        tone: (tip.type === "WCAG" ? "error" : tip.type === "UDL" ? "warning" : "info") as "error" | "warning" | "info",
        section: tip.section,
    }));

    return {
        pedagogicalScore,
        wcagScore,
        udlItems,
        wcagItems,
        problems,
    };
}
