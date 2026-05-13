"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { CuestionarioPayload } from "@/interfaces/actividades";
import { MATERIAS } from "@/constants/Materias";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";
import { analyzeObjetivo } from "@/utils/microtipsAnalysis";

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

const SUBJECT_OPTIONS = Object.values(MATERIAS);

function SubjectDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // When opening, position highlight on the currently-selected option
  useEffect(() => {
    if (open) {
      const selectedIdx = SUBJECT_OPTIONS.indexOf(value);
      setHighlightIndex(selectedIdx >= 0 ? selectedIdx : 0);
    } else {
      setHighlightIndex(-1);
    }
  }, [open, value]);

  // Keep highlighted option visible
  useEffect(() => {
    if (!open || highlightIndex < 0 || !listRef.current) return;
    const node = listRef.current.querySelectorAll<HTMLElement>("[role='option']")[highlightIndex];
    node?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex, open]);

  const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    } else if (event.key === "Escape" && open) {
      setOpen(false);
    }
  };

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % SUBJECT_OPTIONS.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + SUBJECT_OPTIONS.length) % SUBJECT_OPTIONS.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      setHighlightIndex(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setHighlightIndex(SUBJECT_OPTIONS.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (highlightIndex >= 0) {
        onChange(SUBJECT_OPTIONS[highlightIndex]);
        setOpen(false);
        buttonRef.current?.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Selecciona una materia"
        className="w-full flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white px-4 py-3.5 font-lexend text-base text-[#0F172A] hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent transition-colors"
      >
        <span className={value ? "text-[#0F172A]" : "text-[#94A3B8]"}>
          {value || "Selecciona una materia"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className={`text-[#64748B] transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Materias disponibles"
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white shadow-lg shadow-slate-900/5 focus:outline-none"
          // Auto-focus the list when it opens so keyboard works immediately
          ref={(el) => {
            listRef.current = el;
            if (el) el.focus();
          }}
        >
          {SUBJECT_OPTIONS.map((subject, idx) => {
            const isSelected = subject === value;
            const isHighlighted = idx === highlightIndex;
            return (
              <button
                key={subject}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(subject);
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                onMouseEnter={() => setHighlightIndex(idx)}
                className={`w-full flex items-center justify-between px-4 py-3 font-lexend text-sm text-left transition-colors ${
                  isHighlighted ? "bg-[#EEF4FF]" : "hover:bg-[#F8FAFC]"
                } ${isSelected ? "text-[#135BEC] font-bold" : "text-[#0F172A]"}`}
              >
                {subject}
                {isSelected ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ObjetivoStep({ onNext }: ObjetivoStepProps) {
  const selectedActividad = useActividadesStore((state) => state.selectedActividad);
  const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
  const setQuestionnaireDraft = useActividadesStore((state) => state.setQuestionnaireDraft);
  const draftSubject = useActividadesStore((state) => state.draftSubject);
  const setDraftSubject = useActividadesStore((state) => state.setDraftSubject);
  const setEditorSectionCompleted = useUiStore((state) => state.setEditorSectionCompleted);
  const addMicrotip = useUiStore((state) => state.addMicrotip);
  const clearMicrotipsForSection = useUiStore((state) => state.clearMicrotipsForSection);

  const activityTitle = questionnaireDraft?.activityTitle ?? selectedActividad?.title ?? "";
  const objective = questionnaireDraft?.objective ?? "";
  const subject = draftSubject || selectedActividad?.subject || "";

  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      // Hydrate subject from selected actividad if not already set
      if (!draftSubject && selectedActividad?.subject) {
        setDraftSubject(selectedActividad.subject);
      }
      return;
    }

    const defaultDraft = createDefaultDraft();
    setQuestionnaireDraft(defaultDraft);
  }, [
    questionnaireDraft,
    selectedActividad?.id,
    selectedActividad?.payload,
    selectedActividad?.subject,
    selectedActividad?.type,
    setQuestionnaireDraft,
    draftSubject,
    setDraftSubject,
  ]);

  const isTitleValid = useMemo(() => activityTitle.trim().length >= 5, [activityTitle]);
  const isSubjectValid = useMemo(() => subject.trim().length > 0, [subject]);
  const isObjectiveValid = useMemo(() => objective.trim().length >= 15, [objective]);
  const isStepValid = isTitleValid && isSubjectValid && isObjectiveValid;

  useEffect(() => {
    setEditorSectionCompleted("objetivo", isStepValid);
  }, [isStepValid, setEditorSectionCompleted]);

  useEffect(() => {
    if (!questionnaireDraft) return;
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    analysisTimer.current = setTimeout(() => {
      clearMicrotipsForSection("objetivo");
      const tips = analyzeObjetivo(questionnaireDraft);
      tips.forEach((tip) => addMicrotip(tip));
    }, 1200);

    return () => {
      if (analysisTimer.current) clearTimeout(analysisTimer.current);
    };
  }, [questionnaireDraft?.objective, addMicrotip, clearMicrotipsForSection, questionnaireDraft]);

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

        {/* Subject dropdown */}
        <div className="flex flex-col gap-3">
          <label className="font-lexend text-sm font-bold text-[#334155]">Materia / Tema</label>
          <SubjectDropdown value={subject} onChange={setDraftSubject} />
          <p className="font-lexend text-xs text-[#94A3B8]">
            Selecciona el área temática a la que pertenece esta actividad.
          </p>
          <p className={`font-lexend text-xs font-semibold ${isSubjectValid ? "text-emerald-600" : "text-amber-600"}`}>
            {isSubjectValid ? "Materia seleccionada" : "Selecciona una materia"}
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
