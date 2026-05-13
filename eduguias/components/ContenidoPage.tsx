"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import type { CuestionarioPayload, Question } from "@/interfaces/actividades";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";
import { analyzeContenido } from "@/utils/microtipsAnalysis";

interface ContenidoStepProps {
    onNext: () => void;
    onPrev: () => void;
}

const createDefaultQuestion = (): Question => ({
    id: "question-1",
    title: "",
    imageUrl: "",
    imageAlt: "",
    options: [
        { id: "option-1", label: "", isCorrect: true },
        { id: "option-2", label: "", isCorrect: false },
        { id: "option-3", label: "", isCorrect: false },
        { id: "option-4", label: "", isCorrect: false },
    ],
    explanation: "",
});

const createDefaultDraft = (): CuestionarioPayload => ({
    objective: "",
    instructions: "",
    questions: [createDefaultQuestion()],
    feedbackMode: "per-question",
    showCorrectAnswers: true,
    generalMessage: "",
});

const isCuestionarioPayload = (value: unknown): value is CuestionarioPayload => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as CuestionarioPayload;
    return Array.isArray(candidate.questions) && typeof candidate.instructions === "string";
};

export function ContenidoStep({ onNext, onPrev }: ContenidoStepProps) {
    const selectedActividad = useActividadesStore((state) => state.selectedActividad);
    const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
    const setQuestionnaireDraft = useActividadesStore((state) => state.setQuestionnaireDraft);
    const setEditorSectionCompleted = useUiStore((state) => state.setEditorSectionCompleted);
    const addMicrotip = useUiStore((state) => state.addMicrotip);
    const clearMicrotipsForSection = useUiStore((state) => state.clearMicrotipsForSection);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const selectedQuestionnairePayload =
        selectedActividad?.type === "cuestionario" && isCuestionarioPayload(selectedActividad.payload)
            ? selectedActividad.payload
            : null;

    const draft = questionnaireDraft ?? selectedQuestionnairePayload ?? createDefaultDraft();
    const questions = useMemo(
        () => (draft.questions.length > 0 ? draft.questions : [createDefaultQuestion()]),
        [draft.questions]
    );
    const safeActiveQuestionIndex = Math.min(activeQuestionIndex, Math.max(questions.length - 1, 0));
    const question = questions[safeActiveQuestionIndex] ?? questions[0] ?? createDefaultQuestion();

    useEffect(() => {
        if (!questionnaireDraft) {
            setQuestionnaireDraft(draft);
        }
    }, [draft, questionnaireDraft, setQuestionnaireDraft]);

    const updateDraft = (updater: (current: CuestionarioPayload) => CuestionarioPayload) => {
        const nextDraft = updater(draft);
        setQuestionnaireDraft(nextDraft);
    };

    const updateQuestion = (updater: (current: Question) => Question) => {
        updateDraft((currentDraft) => ({
            ...currentDraft,
            questions: currentDraft.questions.map((currentQuestion, index) =>
                index === safeActiveQuestionIndex ? updater(currentQuestion) : currentQuestion
            ),
        }));
    };

    const addQuestion = () => {
        const nextQuestionIndex = questions.length + 1;
        const nextQuestion = {
            id: `question-${nextQuestionIndex}`,
            title: "",
            imageUrl: "",
            imageAlt: "",
            options: [
                { id: `option-${nextQuestionIndex}-1`, label: "", isCorrect: true },
                { id: `option-${nextQuestionIndex}-2`, label: "", isCorrect: false },
                { id: `option-${nextQuestionIndex}-3`, label: "", isCorrect: false },
                { id: `option-${nextQuestionIndex}-4`, label: "", isCorrect: false },
            ],
            explanation: "",
        } satisfies Question;

        updateDraft((currentDraft) => ({
            ...currentDraft,
            questions: [...currentDraft.questions, nextQuestion],
        }));
        setActiveQuestionIndex(questions.length);
    };

    const addOption = () => {
        updateQuestion((currentQuestion) => {
            const nextOptionNumber = currentQuestion.options.length + 1;
            return {
                ...currentQuestion,
                options: [
                    ...currentQuestion.options,
                    {
                        id: `option-${nextOptionNumber}`,
                        label: "",
                        isCorrect: false,
                    },
                ],
            };
        });
    };

    const removeQuestion = () => {
        if (questions.length <= 1) {
            return;
        }

        updateDraft((currentDraft) => ({
            ...currentDraft,
            questions: currentDraft.questions.filter((_, index) => index !== safeActiveQuestionIndex),
        }));

        const nextIndex = Math.max(Math.min(safeActiveQuestionIndex, questions.length - 2), 0);
        setActiveQuestionIndex(nextIndex);
        setImageError(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const setCorrectOption = (selectedOptionId: string) => {
        updateQuestion((currentQuestion) => ({
            ...currentQuestion,
            options: currentQuestion.options.map((option) => ({
                ...option,
                isCorrect: option.id === selectedOptionId,
            })),
        }));
    };

    const updateOption = (optionId: string, label: string) => {
        updateQuestion((currentQuestion) => ({
            ...currentQuestion,
            options: currentQuestion.options.map((option) =>
                option.id === optionId ? { ...option, label } : option
            ),
        }));
    };

    const removeOption = (optionId: string) => {
        updateQuestion((currentQuestion) => {
            const nextOptions = currentQuestion.options.filter((option) => option.id !== optionId);
            const hasCorrect = nextOptions.some((option) => option.isCorrect);

            return {
                ...currentQuestion,
                options: nextOptions.length > 0
                    ? nextOptions.map((option, index) => ({
                        ...option,
                        isCorrect: hasCorrect ? option.isCorrect : index === 0,
                    }))
                    : currentQuestion.options,
            };
        });
    };

    const readImageAsDataUrl = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (typeof fileReader.result === "string") {
                    resolve(fileReader.result);
                    return;
                }
                reject(new Error("No se pudo leer la imagen"));
            };
            fileReader.onerror = () => reject(new Error("No se pudo leer la imagen"));
            fileReader.readAsDataURL(file);
        });

    const handleImageFile = async (file?: File | null) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setImageError("Solo puedes subir archivos de imagen.");
            return;
        }

        try {
            const imageDataUrl = await readImageAsDataUrl(file);
            updateQuestion((currentQuestion) => ({
                ...currentQuestion,
                imageUrl: imageDataUrl,
                imageAlt: currentQuestion.imageAlt ?? "",
            }));
            setImageError(null);
        } catch {
            setImageError("No se pudo procesar la imagen. Intenta de nuevo.");
        }
    };

    const clearImage = () => {
        updateQuestion((currentQuestion) => ({
            ...currentQuestion,
            imageUrl: "",
            imageAlt: "",
        }));
        setImageError(null);
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    const activeQuestion = useMemo(() => question, [question]);
    const contenidoValidationMessage = useMemo(() => {
        if (questions.length === 0) {
            return "Agrega al menos una pregunta.";
        }

        for (let index = 0; index < questions.length; index += 1) {
            const item = questions[index];
            const questionLabel = `Pregunta ${index + 1}`;

            if (item.title.trim().length < 5) {
                return `${questionLabel}: completa el titulo (minimo 5 caracteres).`;
            }

            if (item.options.length < 2) {
                return `${questionLabel}: agrega al menos 2 opciones.`;
            }

            if (item.options.some((option) => option.label.trim().length === 0)) {
                return `${questionLabel}: completa el texto de todas las opciones.`;
            }

            if (!item.options.some((option) => option.isCorrect)) {
                return `${questionLabel}: marca una respuesta correcta.`;
            }

            if ((item.explanation ?? "").trim().length < 5) {
                return `${questionLabel}: agrega la explicacion (minimo 5 caracteres).`;
            }

            const hasImage = (item.imageUrl ?? "").trim().length > 0;
            const hasImageAlt = (item.imageAlt ?? "").trim().length > 0;

            if (hasImage && !hasImageAlt) {
                return `${questionLabel}: completa el texto alternativo de la imagen.`;
            }
        }

        return null;
    }, [questions]);
    const isContenidoValid = contenidoValidationMessage === null;

    useEffect(() => {
        setEditorSectionCompleted("contenido", isContenidoValid);
    }, [isContenidoValid, setEditorSectionCompleted]);

    const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (!draft) return;
        if (analysisTimer.current) clearTimeout(analysisTimer.current);
        analysisTimer.current = setTimeout(() => {
            clearMicrotipsForSection("contenido");
            const tips = analyzeContenido(draft);
            tips.forEach((tip) => addMicrotip(tip));
        }, 1000);
        return () => {
            if (analysisTimer.current) clearTimeout(analysisTimer.current);
        };
    }, [draft.questions, addMicrotip, clearMicrotipsForSection]);

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
                <h2 className="font-lexend text-3xl font-bold text-[#0F172A]">Contenido del cuestionario</h2>
                <p className="font-lexend text-base text-[#64748B]">
                    Paso 2 de 5: Construye las preguntas y respuestas del cuestionario. Lo que edites aqui se vera en la vista previa de la paleta.
                </p>
            </div>

            <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
                <div className="w-full rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
                    <div className="space-y-8">
                        {/* Instrucciones */}
                        <div className="space-y-3">
                            <label className="font-lexend text-sm font-bold text-[#0F172A]">Instrucciones para el estudiante</label>
                            <textarea
                                value={draft.instructions}
                                onChange={(event) =>
                                    updateDraft((currentDraft) => ({
                                        ...currentDraft,
                                        instructions: event.target.value,
                                    }))
                                }
                                className="w-full min-h-24 p-4 rounded-xl border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent resize-none"
                                placeholder="Ej: Lee cada pregunta cuidadosamente. Selecciona la opción que consideres correcta. Tienes tiempo ilimitado para responder."
                            />
                            <p className="font-lexend text-xs text-[#94A3B8]">
                                Estas instrucciones aparecerán al inicio del cuestionario para guiar a los estudiantes.
                            </p>
                        </div>

                        <div className="flex items-center justify-end mb-2">
                            {questions.length > 1 ? (
                                <button
                                    type="button"
                                    onClick={removeQuestion}
                                    className="text-xs font-bold text-[#EF4444] hover:text-[#DC2626]"
                                >
                                    Eliminar pregunta
                                </button>
                            ) : null}
                        </div>

                        {/* Question title */}
                        <div className="space-y-3">
                            <label className="font-lexend text-sm font-bold text-[#0F172A]">Titulo de la pregunta</label>
                            <textarea
                                value={activeQuestion.title}
                                onChange={(event) =>
                                    updateQuestion((currentQuestion) => ({
                                        ...currentQuestion,
                                        title: event.target.value,
                                    }))
                                }
                                className="w-full min-h-32 p-4 rounded-xl border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent resize-none"
                                placeholder="Escriba un titulo descriptivo para la pregunta"
                            />
                        </div>

                        {/* Image upload area – centered icon + text */}
                        <div className="space-y-3">
                            <label className="font-lexend text-sm font-bold text-[#0F172A]">Imagen de soporte (opcional)</label>
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    void handleImageFile(file);
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    setIsDraggingImage(true);
                                }}
                                onDragLeave={() => setIsDraggingImage(false)}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    setIsDraggingImage(false);
                                    const file = event.dataTransfer.files?.[0] ?? null;
                                    void handleImageFile(file);
                                }}
                                className={`w-full rounded-xl border-2 border-dashed py-10 px-4 transition-colors flex flex-col items-center justify-center gap-3 ${isDraggingImage ? "border-[#135BEC] bg-[#EEF4FF]" : "border-[#CBD5E1] bg-[#F8FAFC] hover:border-[#94A3B8]"
                                    }`}
                            >
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect x="5" y="9" width="22" height="16" rx="2" stroke="#94A3B8" strokeWidth="1.8" fill="none" />
                                    <circle cx="11" cy="15" r="1.6" fill="#94A3B8" />
                                    <path d="M5 21l5.5-5.5L17 22l4-4 6 7" stroke="#94A3B8" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                                </svg>
                                <p className="font-lexend text-sm text-[#64748B] text-center leading-snug">
                                    Arrastra y suelta o presiona<br />para cargar una imagen
                                </p>
                            </button>
                            {activeQuestion.imageUrl ? (
                                <div className="space-y-3 mt-2">
                                    <Image
                                        src={activeQuestion.imageUrl}
                                        alt={activeQuestion.imageAlt?.trim() || "Vista previa de la imagen"}
                                        width={800}
                                        height={480}
                                        className="max-h-48 w-full rounded-lg border border-[#E2E8F0] object-contain bg-white"
                                    />
                                    <div className="flex items-center justify-between gap-3">
                                        <input
                                            type="text"
                                            value={activeQuestion.imageAlt ?? ""}
                                            onChange={(event) =>
                                                updateQuestion((currentQuestion) => ({
                                                    ...currentQuestion,
                                                    imageAlt: event.target.value,
                                                }))
                                            }
                                            className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 font-lexend text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
                                            placeholder="Describe la imagen para accesibilidad (alt)"
                                        />
                                        <button
                                            type="button"
                                            onClick={clearImage}
                                            className="text-xs font-bold text-[#EF4444] hover:text-[#DC2626] whitespace-nowrap"
                                        >
                                            Quitar imagen
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                            {imageError ? <p className="font-lexend text-xs text-[#DC2626]">{imageError}</p> : null}
                        </div>

                        {/* Respuesta correcta */}
                        <div className="space-y-3">
                            <label className="font-lexend text-sm font-bold text-[#0F172A]">Respuesta correcta</label>
                            {(() => {
                                const correctOption = activeQuestion.options.find((opt) => opt.isCorrect)
                                    ?? activeQuestion.options[0];
                                if (!correctOption) return null;
                                return (
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setCorrectOption(correctOption.id)}
                                            aria-label="Esta es la respuesta correcta"
                                            className="w-5 h-5 shrink-0 rounded-full border-2 border-[#135BEC] flex items-center justify-center"
                                        >
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#135BEC]" />
                                        </button>
                                        <input
                                            type="text"
                                            value={correctOption.label}
                                            onChange={(event) => updateOption(correctOption.id, event.target.value)}
                                            className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
                                            placeholder={`Opción 1`}
                                        />
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Opciones de respuesta (todas las que NO son correctas) */}
                        <div className="space-y-3">
                            <label className="font-lexend text-sm font-bold text-[#0F172A]">Opciones de respuesta</label>
                            <div className="space-y-3">
                                {activeQuestion.options
                                    .filter((opt) => !opt.isCorrect || opt.id !== (activeQuestion.options.find((o) => o.isCorrect)?.id ?? activeQuestion.options[0]?.id))
                                    .map((option, idx) => (
                                        <div key={option.id} className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setCorrectOption(option.id)}
                                                aria-label="Marcar como respuesta correcta"
                                                className="w-5 h-5 shrink-0 rounded-full border-2 border-[#CBD5E1] hover:border-[#135BEC] transition-colors"
                                            />
                                            <input
                                                type="text"
                                                value={option.label}
                                                onChange={(event) => updateOption(option.id, event.target.value)}
                                                className="flex-1 px-4 py-3 rounded-xl border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
                                                placeholder={`Opción ${idx + 2}`}
                                            />
                                            {activeQuestion.options.length > 2 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(option.id)}
                                                    aria-label="Eliminar opción"
                                                    className="shrink-0 p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                        <path d="M3 4.5h12M7.5 7.5v6M10.5 7.5v6M4.5 4.5l.75 9.75A1.5 1.5 0 0 0 6.748 15.75h4.504a1.5 1.5 0 0 0 1.498-1.5L13.5 4.5M6.75 4.5V3a1.5 1.5 0 0 1 1.5-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v1.5"
                                                            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            ) : null}
                                        </div>
                                    ))}
                            </div>
                            <button
                                type="button"
                                onClick={addOption}
                                className="flex items-center gap-2 px-1 py-2 text-[#135BEC] font-lexend font-bold text-sm hover:underline"
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M9 5.5V12.5M5.5 9H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Añadir opción
                            </button>
                        </div>

                        {/* Explicación */}
                        <div className="space-y-3 pt-4 border-t border-[#F1F5F9]">
                            <label className="font-lexend text-sm font-bold text-[#0F172A]">Explicación de respuesta correcta</label>
                            <textarea
                                value={activeQuestion.explanation ?? ""}
                                onChange={(event) =>
                                    updateQuestion((currentQuestion) => ({
                                        ...currentQuestion,
                                        explanation: event.target.value,
                                    }))
                                }
                                className="w-full min-h-24 p-4 rounded-xl border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent resize-none"
                                placeholder="Escriba un contexto de porque la respuesta es correcta"
                            />
                        </div>
                    </div>
                </div>

                <aside
                    aria-label="Lista de preguntas"
                    className="flex shrink-0 flex-row gap-3 self-start px-1 pt-2 xl:flex-col xl:pt-2 flex-wrap"
                >
                    {questions.map((_, index) => {
                        const isActive = index === safeActiveQuestionIndex;

                        return (
                            <button
                                key={`question-step-${index + 1}`}
                                type="button"
                                onClick={() => setActiveQuestionIndex(index)}
                                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-colors ${isActive
                                    ? "border-[#135BEC] bg-[#135BEC] text-white shadow-md shadow-[#135BEC]/20"
                                    : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                aria-label={`Ir a la pregunta ${index + 1}`}
                            >
                                {index + 1}
                            </button>
                        );
                    })}

                    <button
                        type="button"
                        onClick={addQuestion}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-bold text-slate-500 transition-colors hover:border-[#135BEC] hover:text-[#135BEC] hover:bg-[#EEF4FF]"
                        aria-label="Agregar una nueva pregunta"
                        title="Agregar una nueva pregunta"
                    >
                        +
                    </button>
                </aside>
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
                    disabled={!isContenidoValid}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-lexend font-bold text-base transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)] ${isContenidoValid ? "bg-[#135BEC] hover:bg-[#0f4fd1]" : "bg-[#94A3B8] cursor-not-allowed"
                        }`}
                >
                    Siguiente
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
                    </svg>
                </button>
            </div>
            {!isContenidoValid && contenidoValidationMessage ? (
                <p className="font-lexend text-sm font-semibold text-[#B91C1C]">{contenidoValidationMessage}</p>
            ) : null}
        </div>
    );
}
