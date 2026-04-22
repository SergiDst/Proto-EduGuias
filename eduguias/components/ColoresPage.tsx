"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

import type { CuestionarioPayload, Question } from "../interfaces/actividades";
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
            };
        }

        return {
            title: selectedActividad?.title || "Cuestionario sin preguntas",
            subject: selectedActividad?.subject || "Cuestionario",
            instructions: draftSource.instructions,
            question: draftSource.questions[0],
        };
    }, [questionnaireDraft, selectedActividad]);

    const highlightedOptionIndex = preview.question.options.findIndex((option) => option.isCorrect);
    const activeOptionIndex = highlightedOptionIndex >= 0 ? highlightedOptionIndex : 0;
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
            <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                <div className="border-b border-slate-200 bg-linear-to-r from-[#0F172A] via-[#123F7A] to-[#135BEC] px-8 py-6 text-white">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
                            Vista previa real
                        </span>
                        <span className="text-sm text-white/80">{preview.subject}</span>
                    </div>
                    <h1 className="mt-4 text-3xl font-bold leading-tight">{preview.title}</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/80">{preview.instructions}</p>
                </div>

                <div className="p-8 md:p-10">
                    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                        {preview.question.imageUrl ? (
                            <Image
                                src={preview.question.imageUrl}
                                alt={preview.question.title}
                                width={960}
                                height={560}
                                unoptimized
                                className="h-56 w-full rounded-xl object-cover"
                            />
                        ) : (
                            <div className="flex h-56 w-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-6 text-center text-sm text-slate-500">
                                La imagen de la primera pregunta se mostrara aqui si agregas una.
                            </div>
                        )}

                        <div className="space-y-3">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#135BEC]">
                                Pregunta 1
                            </p>
                            <h2 className="text-2xl font-bold leading-tight text-slate-900">
                                {preview.question.title}
                            </h2>
                        </div>

                        <div className="space-y-3 pt-2">
                            {preview.question.options.map((option, index) => {
                                const isActive = index === activeOptionIndex;

                                return (
                                    <div
                                        key={option.id}
                                        className={`flex items-start gap-4 rounded-2xl border p-4 transition-colors ${isActive ? "border-[#135BEC] bg-[#EEF4FF]" : "border-slate-200 bg-white"
                                            }`}
                                    >
                                        <div
                                            className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${isActive ? "border-[#135BEC] bg-[#135BEC]" : "border-slate-300 bg-white"
                                                }`}
                                        >
                                            {isActive ? <div className="h-2.5 w-2.5 rounded-full bg-white" /> : null}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-base font-medium leading-6 text-slate-800">{option.label}</p>
                                            {option.isCorrect ? (
                                                <p className="mt-1 text-sm font-medium text-emerald-700">Opcion correcta</p>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900">
                            {preview.question.explanation ??
                                "Aqui puedes mostrar la explicacion de la primera pregunta cuando el usuario la configure en el editor."}
                        </div>

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
