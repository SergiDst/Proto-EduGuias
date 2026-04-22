"use client";

import { useEffect, useMemo } from "react";

import type { CuestionarioPayload } from "@/interfaces/actividades";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";

interface ObjetivoStepProps {
  onNext: () => void;
}

const createDefaultDraft = (): CuestionarioPayload => ({
  activityTitle: "",
  objective: "",
  instructions: "",
  questions: [],
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

export function ObjetivoStep({ onNext }: ObjetivoStepProps) {
  const selectedActividad = useActividadesStore((state) => state.selectedActividad);
  const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
  const setQuestionnaireDraft = useActividadesStore((state) => state.setQuestionnaireDraft);
  const setEditorSectionCompleted = useUiStore((state) => state.setEditorSectionCompleted);
  const activityTitle = questionnaireDraft?.activityTitle ?? selectedActividad?.title ?? "";
  const objective = questionnaireDraft?.objective ?? "";

  useEffect(() => {
    const payloadFromActividad =
      selectedActividad?.type === "cuestionario" && isCuestionarioPayload(selectedActividad.payload)
        ? selectedActividad.payload
        : null;

    const sourcePayload = questionnaireDraft ?? payloadFromActividad;
    if (sourcePayload) {
      if (!questionnaireDraft) {
        setQuestionnaireDraft(sourcePayload);
      }
      return;
    }

    const defaultDraft = createDefaultDraft();
    setQuestionnaireDraft(defaultDraft);
  }, [questionnaireDraft, selectedActividad?.id, selectedActividad?.payload, selectedActividad?.type, setQuestionnaireDraft]);

  const isTitleValid = useMemo(() => activityTitle.trim().length >= 5, [activityTitle]);
  const isObjectiveValid = useMemo(() => objective.trim().length >= 15, [objective]);
  const isStepValid = isTitleValid && isObjectiveValid;

  useEffect(() => {
    setEditorSectionCompleted("objetivo", isStepValid);
  }, [isStepValid, setEditorSectionCompleted]);

  const handleObjectiveChange = (value: string) => {
    const basePayload = questionnaireDraft ?? createDefaultDraft();
    setQuestionnaireDraft({
      ...basePayload,
      objective: value,
    });
  };

  const handleActivityTitleChange = (value: string) => {
    const basePayload = questionnaireDraft ?? createDefaultDraft();
    setQuestionnaireDraft({
      ...basePayload,
      activityTitle: value,
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <h1 className="font-lexend text-3xl font-bold text-[#0F172A]">Define tus objetivos</h1>
        <p className="font-lexend text-base text-[#64748B]">
          Establece la base de tu cuestionario especificando qué deben aprender los estudiantes y para quién es la evaluación.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label className="font-lexend text-sm font-bold text-[#334155]">Titulo de la actividad</label>
          <input
            type="text"
            value={activityTitle}
            onChange={(event) => handleActivityTitleChange(event.target.value)}
            className="w-full rounded-xl border border-[#E2E8F0] bg-white p-4 font-lexend text-base text-[#334155] placeholder-[#94A3B8] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#135BEC]"
            placeholder="Ej: Cuestionario de termodinamica - Nivel 1"
          />
          <p className="font-lexend text-xs text-[#94A3B8]">
            Este titulo se mostrara en la vista previa y se guardara con la actividad.
          </p>
          <p className={`font-lexend text-xs font-semibold ${isTitleValid ? "text-emerald-600" : "text-amber-600"}`}>
            {isTitleValid ? "Titulo completo" : "Minimo 5 caracteres"}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-lexend text-sm font-bold text-[#334155]">Objetivo de aprendizaje</label>
          <textarea
            value={objective}
            onChange={(event) => handleObjectiveChange(event.target.value)}
            className="w-full min-h-40 rounded-xl border border-[#E2E8F0] bg-white p-4 font-lexend text-base text-[#334155] placeholder-[#94A3B8] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#135BEC]"
            placeholder="Ej: Al final de este cuestionario, los estudiantes podran identificar las tres leyes primarias de la termodinamica y aplicarlas a sistemas mecanicos simples."
          />
          <div className="flex items-center justify-between gap-3">
            <p className="font-lexend text-xs text-[#94A3B8]">
              Intenta ser lo más específico posible sobre los resultados deseados.
            </p>
            <p className={`font-lexend text-xs font-semibold ${isObjectiveValid ? "text-emerald-600" : "text-amber-600"}`}>
              {isObjectiveValid ? "Objetivo completo" : "Minimo 15 caracteres"}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button
            onClick={onNext}
            disabled={!isStepValid}
            className={`flex items-center gap-2 rounded-xl px-8 py-3 font-lexend text-base font-bold text-white transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)] ${
              isStepValid ? "bg-[#135BEC] hover:bg-[#0f4fd1]" : "cursor-not-allowed bg-[#94A3B8]"
            }`}
          >
            Siguiente
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
