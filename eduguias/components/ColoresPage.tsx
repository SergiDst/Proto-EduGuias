"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

import type {
    CuestionarioPayload,
    Question,
    QuestionnairePalette,
    QuestionnairePaletteMode,
} from "../interfaces/actividades";
import { useActividadesStore } from "../stores/actividadesStore";
import { useUiStore } from "../stores/uiStore";

interface ColoresStepProps {
    onNext: () => void;
    onPrev: () => void;
}

const isCuestionarioPayload = (value: unknown): value is CuestionarioPayload => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as CuestionarioPayload;
    return Array.isArray(candidate.questions) && typeof candidate.instructions === "string";
};

const fallbackQuestion: Question = {
    id: "preview-question",
    title: "Aun no hay contenido cargado para mostrar la vista previa",
    options: [
        { id: "opt-1", label: "Agrega preguntas en la seccion de Contenido", isCorrect: false },
        { id: "opt-2", label: "La vista previa se actualizara automaticamente", isCorrect: false },
    ],
};

const defaultPalette: QuestionnairePalette = {
    fontFamily: "inter",
    titleSize: 20,
    subtitleSize: 18,
    bodySize: 16,
    textColor: "#0F172A",
    backgroundColor: "#FFFFFF",
    mode: "alto-contraste",
};

const modeTokens: Record<
    QuestionnairePaletteMode,
    {
        headerGradient: string;
        cardBg: string;
        cardBorder: string;
        optionActiveBg: string;
        optionActiveBorder: string;
        explanationBg: string;
        explanationBorder: string;
    }
> = {
    "alto-contraste": {
        headerGradient: "linear-gradient(90deg, #0F172A 0%, #123F7A 55%, #135BEC 100%)",
        cardBg: "#F8FAFC",
        cardBorder: "#E2E8F0",
        optionActiveBg: "#EEF4FF",
        optionActiveBorder: "#135BEC",
        explanationBg: "#FFF7ED",
        explanationBorder: "#FCD9BD",
    },
    "modo-lectura": {
        headerGradient: "linear-gradient(90deg, #334155 0%, #475569 55%, #64748B 100%)",
        cardBg: "#F8FAFC",
        cardBorder: "#CBD5E1",
        optionActiveBg: "#F1F5F9",
        optionActiveBorder: "#334155",
        explanationBg: "#F8FAFC",
        explanationBorder: "#CBD5E1",
    },
    "pastel-suave": {
        headerGradient: "linear-gradient(90deg, #7C3AED 0%, #4F46E5 50%, #0EA5E9 100%)",
        cardBg: "#F5F3FF",
        cardBorder: "#DDD6FE",
        optionActiveBg: "#EEF2FF",
        optionActiveBorder: "#6366F1",
        explanationBg: "#ECFEFF",
        explanationBorder: "#A5F3FC",
    },
};

export function ColoresStep({ onNext, onPrev }: ColoresStepProps) {
    const selectedActividad = useActividadesStore((state) => state.selectedActividad);
    const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
    const setEditorSectionCompleted = useUiStore((state) => state.setEditorSectionCompleted);

    const preview = useMemo(() => {
        const draftSource = questionnaireDraft ?? (selectedActividad?.type === "cuestionario" ? selectedActividad.payload : null);

        if (!draftSource || !isCuestionarioPayload(draftSource) || draftSource.questions.length === 0) {
            return {
                title: "Vista previa de la actividad",
                subject: "Cuestionario",
                instructions:
                    "El contenido real de la actividad aparecera aqui cuando selecciones o cargues una actividad.",
                question: fallbackQuestion,
                palette: defaultPalette,
                showPerQuestionExplanation: true,
            };
        }

        return {
            title: draftSource.activityTitle?.trim() || selectedActividad?.title || "Cuestionario sin preguntas",
            subject: selectedActividad?.subject || "Cuestionario",
            instructions: draftSource.instructions,
            question: draftSource.questions[0],
            palette: draftSource.palette ?? defaultPalette,
            showPerQuestionExplanation: draftSource.feedbackMode === "per-question",
        };
    }, [questionnaireDraft, selectedActividad]);

    const highlightedOptionIndex = preview.question.options.findIndex((option) => option.isCorrect);
    const activeOptionIndex = highlightedOptionIndex >= 0 ? highlightedOptionIndex : 0;
    const paletteTokens = modeTokens[preview.palette.mode] ?? modeTokens["alto-contraste"];
    const previewFontFamily =
        preview.palette.fontFamily === "roboto"
            ? "var(--font-roboto), sans-serif"
            : preview.palette.fontFamily === "source-sans-3"
                ? "var(--font-source-sans-3), sans-serif"
                : "var(--font-inter), sans-serif";
    const isPaletaValid = useMemo(() => {
        const draftSource = questionnaireDraft ?? (selectedActividad?.type === "cuestionario" ? selectedActividad.payload : null);

        if (!draftSource || !isCuestionarioPayload(draftSource)) {
            return false;
        }

        const hasInstructions = draftSource.instructions.trim().length >= 10;
        const hasQuestion = draftSource.questions.length > 0;
        const isFirstQuestionValid = hasQuestion
            ? draftSource.questions[0].title.trim().length >= 5 && draftSource.questions[0].options.length >= 2
            : false;

        return hasInstructions && hasQuestion && isFirstQuestionValid;
    }, [questionnaireDraft, selectedActividad]);

    useEffect(() => {
        setEditorSectionCompleted("paleta", isPaletaValid);
    }, [isPaletaValid, setEditorSectionCompleted]);

    return (
        <div className="flex flex-col items-center gap-8 pb-8">
            <div
                className="w-full max-w-3xl overflow-hidden rounded-3xl border shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
                style={{
                    borderColor: paletteTokens.cardBorder,
                    backgroundColor: preview.palette.backgroundColor,
                    color: preview.palette.textColor,
                    fontFamily: previewFontFamily,
                }}
            >
                <div
                    className="border-b px-8 py-6 text-white"
                    style={{
                        borderColor: paletteTokens.cardBorder,
                        background: paletteTokens.headerGradient,
                    }}
                >
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                            Vista previa real
                        </span>
                        <span className="text-white/80" style={{ fontSize: `${Math.max(12, preview.palette.bodySize - 2)}px` }}>
                            {preview.subject}
                        </span>
                    </div>
                    <h1 className="mt-4 font-bold leading-tight" style={{ fontSize: `${preview.palette.titleSize + 10}px` }}>
                        {preview.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-white/80" style={{ fontSize: `${preview.palette.bodySize}px`, lineHeight: 1.6 }}>
                        {preview.instructions}
                    </p>
                </div>

                <div className="p-8 md:p-10">
                    <div
                        className="space-y-4 rounded-2xl border p-6"
                        style={{
                            borderColor: paletteTokens.cardBorder,
                            backgroundColor: paletteTokens.cardBg,
                        }}
                    >
                        {preview.question.imageUrl ? (
                            <Image
                                src={preview.question.imageUrl}
                                alt={preview.question.imageAlt?.trim() || preview.question.title}
                                width={960}
                                height={560}
                                unoptimized
                                className="h-56 w-full rounded-xl object-cover"
                            />
                        ) : null}

                        <div className="space-y-3">
                            <p
                                className="font-semibold uppercase tracking-[0.18em]"
                                style={{
                                    color: preview.palette.textColor,
                                    fontSize: `${Math.max(12, preview.palette.bodySize - 2)}px`,
                                }}
                            >
                                Pregunta 1
                            </p>
                            <h2 className="font-bold leading-tight" style={{ fontSize: `${preview.palette.titleSize + 4}px` }}>
                                {preview.question.title}
                            </h2>
                        </div>

                        <div className="space-y-3 pt-2">
                            {preview.question.options.map((option, index) => {
                                const isActive = index === activeOptionIndex;

                                return (
                                    <div
                                        key={option.id}
                                        className="flex items-start gap-4 rounded-2xl border p-4 transition-colors"
                                        style={{
                                            borderColor: isActive ? paletteTokens.optionActiveBorder : paletteTokens.cardBorder,
                                            backgroundColor: isActive ? paletteTokens.optionActiveBg : "#FFFFFF",
                                        }}
                                    >
                                        <div
                                            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
                                            style={{
                                                borderColor: isActive ? paletteTokens.optionActiveBorder : "#CBD5E1",
                                                backgroundColor: isActive ? paletteTokens.optionActiveBorder : "#FFFFFF",
                                            }}
                                        >
                                            {isActive ? <div className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="font-medium"
                                                style={{
                                                    color: preview.palette.textColor,
                                                    fontSize: `${preview.palette.bodySize}px`,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                {option.label}
                                            </p>
                                            {option.isCorrect ? (
                                                <p className="mt-1 text-sm font-medium text-emerald-700">Opcion correcta</p>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {preview.showPerQuestionExplanation ? (
                            <div
                                className="rounded-2xl border px-5 py-4"
                                style={{
                                    borderColor: paletteTokens.explanationBorder,
                                    backgroundColor: paletteTokens.explanationBg,
                                    color: preview.palette.textColor,
                                    fontSize: `${preview.palette.bodySize}px`,
                                    lineHeight: 1.6,
                                }}
                            >
                                {preview.question.explanation ??
                                    "Aqui puedes mostrar la explicacion de la primera pregunta cuando el usuario la configure en el editor."}
                            </div>
                        ) : null}

                        <div className="flex items-center justify-between gap-4 pt-2">
                            <button
                                type="button"
                                className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-100"
                            >
                                Volver a la anterior
                            </button>
                            <button
                                type="button"
                                className="h-11 rounded-xl bg-[#135BEC] px-4 text-sm font-bold text-white shadow-lg shadow-[#135BEC]/20 transition-colors hover:bg-[#0f4fd1]"
                            >
                                Siguiente pregunta
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="flex justify-between items-center gap-4 pt-8 border-t border-[#F1F5F9]">
                <button
                    onClick={onPrev}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#475569] font-lexend font-bold text-base hover:bg-[#F8FAFC] transition-colors"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#475569" />
                    </svg>
                    Volver atras
                </button>
                <button
                onClick={onNext}
                    disabled={!isPaletaValid}
                    className={`flex items-center gap-2 rounded-xl px-8 py-3 text-base font-bold text-white shadow-lg shadow-[rgba(19,91,236,0.2)] transition-colors ${
                        isPaletaValid ? "bg-[#135BEC] hover:bg-[#0f4fd1]" : "bg-[#94A3B8] cursor-not-allowed"
                    }`}
            >
                Guardar y revisar
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
                </svg>
            </button>
            </div>
            
        </div>
    );
}
