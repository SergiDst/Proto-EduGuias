'use client';

import { useEffect, useMemo, useState } from "react";

import type { CuestionarioPayload } from "@/interfaces/actividades";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";

interface RetroalimentacionStepProps {
  onNext: () => void;
  onPrev: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${checked ? "bg-[#135BEC]" : "bg-[#CBD5E1]"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full border border-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export function RetroalimentacionStep({ onNext, onPrev }: RetroalimentacionStepProps) {
  const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
  const setQuestionnaireDraft = useActividadesStore((state) => state.setQuestionnaireDraft);
  const setEditorSectionCompleted = useUiStore((state) => state.setEditorSectionCompleted);
  const [showExplanations, setShowExplanations] = useState(true);
  const feedbackType: "inmediato" | "finalizar" =
    questionnaireDraft?.feedbackMode === "at-end" ? "finalizar" : "inmediato";
  const showCorrect = questionnaireDraft?.showCorrectAnswers ?? true;
  const generalMessage = questionnaireDraft?.generalMessage ?? "";

  const updateDraft = (updater: (current: CuestionarioPayload) => CuestionarioPayload) => {
    const baseDraft: CuestionarioPayload = questionnaireDraft ?? {
      objective: "",
      instructions: "",
      questions: [],
      feedbackMode: "per-question",
      showCorrectAnswers: true,
      generalMessage: "",
    };

    setQuestionnaireDraft(updater(baseDraft));
  };

  const updateFeedbackType = (value: "inmediato" | "finalizar") => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      feedbackMode: value === "inmediato" ? "per-question" : "at-end",
    }));
  };

  const updateShowCorrect = (value: boolean) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      showCorrectAnswers: value,
    }));
  };

  const updateGeneralMessage = (value: string) => {
    updateDraft((currentDraft) => ({
      ...currentDraft,
      generalMessage: value,
    }));
  };

  const isRetroalimentacionValid = useMemo(
    () => generalMessage.trim().length >= 10,
    [generalMessage]
  );

  useEffect(() => {
    setEditorSectionCompleted("retroalimentacion", isRetroalimentacionValid);
  }, [isRetroalimentacionValid, setEditorSectionCompleted]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="font-lexend text-3xl font-bold text-[#0F172A] tracking-tight">
          Retroalimentación del cuestionario
        </h1>
        <p className="font-lexend text-base text-[#475569]">
          Define cómo y cuándo los estudiantes interactúan con los resultados y las explicaciones.
        </p>
      </div>

      {/* Tipo de retroalimentación */}
      <div className="bg-white rounded-xl border border-[rgba(19,91,236,0.05)] shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <path d="M13.3 14.7L14.7 13.3L11 9.6V5H9V10.4L13.3 14.7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625C17.2208 14.1042 18 12.2167 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z" fill="#135BEC"/>
          </svg>
          <h2 className="font-lexend text-lg font-bold text-[#0F172A]">Tipo de retroalimentación</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Inmediato */}
          <button
            type="button"
            onClick={() => updateFeedbackType("inmediato")}
            className={`relative flex flex-col p-4 rounded-xl border-2 text-left transition-all ${feedbackType === "inmediato" ? "border-[#135BEC] bg-[rgba(19,91,236,0.05)]" : "border-[#F1F5F9]"}`}
          >
            <div className="mb-1 font-lexend text-base font-bold text-[#0F172A]">Inmediato</div>
            <p className="font-lexend text-sm text-[#475569]">
              Los estudiantes ven los resultados y las explicaciones inmediatamente después de cada pregunta.
            </p>
            <div className={`absolute top-4 right-4 w-4.5 h-4.5 rounded-full flex items-center justify-center ${feedbackType === "inmediato" ? "bg-[#135BEC]" : "border border-[#6B7280] bg-white"}`}>
              {feedbackType === "inmediato" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Al finalizar */}
          <button
            type="button"
            onClick={() => updateFeedbackType("finalizar")}
            className={`relative flex flex-col p-4 rounded-xl border-2 text-left transition-all ${feedbackType === "finalizar" ? "border-[#135BEC] bg-[rgba(19,91,236,0.05)]" : "border-[#F1F5F9]"}`}
          >
            <div className="mb-1 font-lexend text-base font-bold text-[#0F172A]">Al finalizar</div>
            <p className="font-lexend text-sm text-[#475569]">
              Los estudiantes reciben un resumen completo después de enviar todas las respuestas.
            </p>
            <div className={`absolute top-4 right-4 w-4.5 h-4.5 rounded-full flex items-center justify-center ${feedbackType === "finalizar" ? "bg-[#135BEC]" : "border border-[#6B7280] bg-white"}`}>
              {feedbackType === "finalizar" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Lo que los estudiantes ven */}
      <div className="bg-white rounded-xl border border-[rgba(19,91,236,0.05)] shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <svg width="22" height="15" viewBox="0 0 22 15" fill="none" className="shrink-0">
            <path d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z" fill="#135BEC"/>
          </svg>
          <h2 className="font-lexend text-lg font-bold text-[#0F172A]">Lo que los estudiantes ven</h2>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center py-2 border-b border-[#F8FAFC]">
            <div>
              <div className="font-lexend text-base font-medium text-[#0F172A]">Respuestas correctas</div>
              <div className="font-lexend text-sm text-[#64748B]">Resaltar la respuesta correcta cuando se selecciona una respuesta erronea</div>
            </div>
            <Toggle checked={showCorrect} onChange={updateShowCorrect} />
          </div>
          <div className="flex justify-between items-center py-2 border-b border-[#F8FAFC]">
            <div>
              <div className="font-lexend text-base font-medium text-[#0F172A]">Explicaciónes</div>
              <div className="font-lexend text-sm text-[#64748B]">Mostrar la explicación de cada respuesta</div>
            </div>
            <Toggle checked={showExplanations} onChange={setShowExplanations} />
          </div>
        </div>
      </div>

      {/* Mensaje general al finalizar */}
      <div className="bg-white rounded-xl border border-[rgba(19,91,236,0.05)] shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <svg width="22" height="21" viewBox="0 0 22 21" fill="none" className="shrink-0">
            <path d="M0 20.5L5 6.5L14 15.5L0 20.5ZM3.3 17.2L10.35 14.7L5.8 10.15L3.3 17.2ZM12.55 11.05L11.5 10L17.1 4.4C17.6333 3.86667 18.275 3.6 19.025 3.6C19.775 3.6 20.4167 3.86667 20.95 4.4L21.55 5L20.5 6.05L19.9 5.45C19.6667 5.21667 19.375 5.1 19.025 5.1C18.675 5.1 18.3833 5.21667 18.15 5.45L12.55 11.05ZM8.55 7.05L7.5 6L8.1 5.4C8.33333 5.16667 8.45 4.88333 8.45 4.55C8.45 4.21667 8.33333 3.93333 8.1 3.7L7.45 3.05L8.5 2L9.15 2.65C9.68333 3.18333 9.95 3.81667 9.95 4.55C9.95 5.28333 9.68333 5.91667 9.15 6.45L8.55 7.05ZM10.55 9.05L9.5 8L13.1 4.4C13.3333 4.16667 13.45 3.875 13.45 3.525C13.45 3.175 13.3333 2.88333 13.1 2.65L11.5 1.05L12.55 0L14.15 1.6C14.6833 2.13333 14.95 2.775 14.95 3.525C14.95 4.275 14.6833 4.91667 14.15 5.45L10.55 9.05ZM14.55 13.05L13.5 12L15.1 10.4C15.6333 9.86667 16.275 9.6 17.025 9.6C17.775 9.6 18.4167 9.86667 18.95 10.4L20.55 12L19.5 13.05L17.9 11.45C17.6667 11.2167 17.375 11.1 17.025 11.1C16.675 11.1 16.3833 11.2167 16.15 11.45L14.55 13.05Z" fill="#135BEC"/>
          </svg>
          <h2 className="font-lexend text-lg font-bold text-[#0F172A]">Mensaje general al finalizar</h2>
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-lexend text-sm font-medium text-[#64748B]">
            Mensaje personalizado mostrado en la pantalla de resultados
          </p>
          <textarea
            value={generalMessage}
            onChange={(event) => updateGeneralMessage(event.target.value)}
            className="w-full min-h-24 p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] font-lexend text-base text-[#6B7280] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent resize-none"
            placeholder="Ej: ¡Excelente trabajo completando el módulo! Revisa los recursos a continuación para un estudio adicional."
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#475569] font-lexend font-bold text-base hover:bg-[#F8FAFC] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#475569"/>
          </svg>
          Volver atras
        </button>
        <button
          onClick={onNext}
          disabled={!isRetroalimentacionValid}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-white font-lexend font-bold text-base transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)] ${
            isRetroalimentacionValid ? "bg-[#135BEC] hover:bg-[#0f4fd1]" : "bg-[#94A3B8] cursor-not-allowed"
          }`}
        >
          Siguiente
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}