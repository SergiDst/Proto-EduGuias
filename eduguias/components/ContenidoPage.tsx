"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import type { CuestionarioPayload, Question } from "@/interfaces/actividades";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";

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
    if (draft.instructions.trim().length < 10) {
      return "Completa las instrucciones (minimo 10 caracteres).";
    }

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
  }, [draft.instructions, questions]);
  const isContenidoValid = contenidoValidationMessage === null;

  useEffect(() => {
    setEditorSectionCompleted("contenido", isContenidoValid);
  }, [isContenidoValid, setEditorSectionCompleted]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-lexend text-3xl font-bold text-[#0F172A]">Contenido del cuestionario</h2>
        <p className="font-lexend text-base text-[#64748B]">
          Paso 2 de 5: Construye las preguntas y respuestas del cuestionario. Lo que edites aqui se vera en la vista previa de la paleta.
        </p>
      </div>

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="w-full  rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
          <div className="space-y-8">
          <div className="space-y-3">
            <label className="font-lexend text-sm font-bold text-[#334155]">Instrucciones de la actividad</label>
            <textarea
              value={draft.instructions}
              onChange={(event) =>
                updateDraft((currentDraft) => ({
                  ...currentDraft,
                  instructions: event.target.value,
                }))
              }
              className="w-full min-h-28 p-4 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
              placeholder="Escriba una instruccion breve y clara para el cuestionario"
            />
          </div>

          <div className="space-y-3">
            <label className="font-lexend text-sm font-bold text-[#334155]">Titulo de la pregunta</label>
            <textarea
              value={activeQuestion.title}
              onChange={(event) =>
                updateQuestion((currentQuestion) => ({
                  ...currentQuestion,
                  title: event.target.value,
                }))
              }
              className="w-full min-h-24 p-4 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
              placeholder="Escriba un titulo descriptivo para la pregunta"
            />
          </div>

          <div className="space-y-3">
            <label className="font-lexend text-sm font-bold text-[#334155]">Imagen de soporte (opcional)</label>
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
            <div
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
              className={`rounded-xl border-2 border-dashed p-5 transition-colors ${
                isDraggingImage ? "border-[#135BEC] bg-[#EEF4FF]" : "border-[#CBD5E1] bg-[#F8FAFC]"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-lexend text-sm text-[#334155]">
                  Arrastra y suelta una imagen aqui o selecciona un archivo desde tu equipo.
                </p>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center justify-center rounded-lg border border-[#135BEC] px-4 py-2 font-lexend text-sm font-bold text-[#135BEC] transition-colors hover:bg-[#EEF4FF]"
                >
                  Seleccionar imagen
                </button>
              </div>
              {activeQuestion.imageUrl ? (
                <div className="mt-4 space-y-3">
                  <Image
                    src={activeQuestion.imageUrl}
                    alt={activeQuestion.imageAlt?.trim() || "Vista previa de la imagen"}
                    width={800}
                    height={480}
                    className="max-h-48 w-full rounded-lg border border-[#E2E8F0] object-contain bg-white"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="text-xs font-bold text-[#EF4444] hover:text-[#DC2626]"
                  >
                    Quitar imagen
                  </button>
                </div>
              ) : null}
            </div>
            {imageError ? <p className="font-lexend text-xs text-[#DC2626]">{imageError}</p> : null}
            {activeQuestion.imageUrl ? (
              <div className="space-y-2">
                <label className="font-lexend text-sm font-bold text-[#334155]">Texto alternativo (obligatorio)</label>
                <input
                  type="text"
                  value={activeQuestion.imageAlt ?? ""}
                  onChange={(event) =>
                    updateQuestion((currentQuestion) => ({
                      ...currentQuestion,
                      imageAlt: event.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 font-lexend text-base text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
                  placeholder="Describe brevemente la imagen para accesibilidad"
                />
              </div>
            ) : null}
            <p className="font-lexend text-xs text-[#64748B]">
              La imagen es opcional. Si subes una imagen, debes completar el texto alternativo.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
            <div className="flex items-center justify-between gap-3">
              <label className="font-lexend text-sm font-bold text-[#334155] block">Opciones de respuesta</label>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center gap-2 px-3 py-2 text-[#135BEC] font-lexend font-bold text-sm hover:bg-[#EEF2FF] rounded transition-colors"
              >
                Añadir opción
              </button>
            </div>

            <div className="space-y-3">
              {activeQuestion.options.map((option) => (
                <div key={option.id} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <input
                    type="radio"
                    name="correct-answer"
                    checked={option.isCorrect}
                    onChange={() => setCorrectOption(option.id)}
                    className="mt-3 w-5 h-5 rounded-full border border-[#CBD5E1] cursor-pointer"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={option.label}
                      onChange={(event) => updateOption(option.id, event.target.value)}
                      className="w-full px-3 py-3.5 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-base text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
                      placeholder="Escriba una opcion"
                    />
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-lexend text-xs text-[#64748B]">
                        {option.isCorrect ? "Esta respuesta es la correcta" : "Marca la opción correcta con el selector"}
                      </span>
                      {activeQuestion.options.length > 2 ? (
                        <button
                          type="button"
                          onClick={() => removeOption(option.id)}
                          className="text-xs font-bold text-[#EF4444] hover:text-[#DC2626]"
                        >
                          Eliminar
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#F1F5F9]">
            <label className="font-lexend text-sm font-bold text-[#334155]">Explicación de respuesta correcta</label>
            <textarea
              value={activeQuestion.explanation ?? ""}
              onChange={(event) =>
                updateQuestion((currentQuestion) => ({
                  ...currentQuestion,
                  explanation: event.target.value,
                }))
              }
              className="w-full min-h-20 p-4 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
              placeholder="Escriba un contexto de porque la respuesta es correcta"
            />
          </div>
        </div>
      </div>

        <aside className="flex shrink-0 flex-row gap-3 self-start px-1 pt-2 xl:flex-col xl:pt-2">
          {questions.map((_, index) => {
            const isActive = index === safeActiveQuestionIndex;

            return (
              <button
                key={`question-step-${index + 1}`}
                type="button"
                onClick={() => setActiveQuestionIndex(index)}
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                  isActive
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
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-lexend font-bold text-base transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)] ${
            isContenidoValid ? "bg-[#135BEC] hover:bg-[#0f4fd1]" : "bg-[#94A3B8] cursor-not-allowed"
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
