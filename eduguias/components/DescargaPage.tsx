"use client";

import { useState } from "react";
import { useActividadesStore } from "@/stores/actividadesStore";
import { generateHtmlActivity } from "@/utils/generateHtml";
import { generateScormPackage } from "@/utils/generateScorm";
import type { CuestionarioPayload } from "@/interfaces/actividades";

function DownloadOptionCard({
  icon,
  title,
  description,
  badge,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onClick?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#EEF2FF] flex items-center justify-center shrink-0">
          {icon}
        </div>
        {badge && (
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 font-lexend text-[11px] font-bold uppercase tracking-wide text-emerald-600">
            {badge}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-lexend text-2xl font-bold text-[#1E293B] leading-tight">
        {title}
      </h3>

      <p className="mt-3 font-lexend text-sm leading-7 text-[#64748B] flex-1">
        {description}
      </p>

      <button
        onClick={onClick}
        disabled={loading}
        className={`mt-6 h-12 rounded-xl font-lexend text-base font-bold transition-colors flex items-center justify-center gap-2 ${
          loading
            ? "bg-[#94A3B8] text-white cursor-not-allowed"
            : "bg-[#135BEC] text-white hover:bg-[#0f4fd1]"
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="20 10" />
            </svg>
            Preparando…
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12V13.5C2 13.776 2.224 14 2.5 14H13.5C13.776 14 14 13.776 14 13.5V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Descargar
          </>
        )}
      </button>
    </div>
  );
}

const isCuestionarioPayload = (value: unknown): value is CuestionarioPayload => {
  if (!value || typeof value !== "object") return false;
  const c = value as CuestionarioPayload;
  return Array.isArray(c.questions) && typeof c.instructions === "string";
};

export function DescargaStep() {
  const selectedActividad = useActividadesStore((state) => state.selectedActividad);
  const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadingScorm, setDownloadingScorm] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const payload: CuestionarioPayload | null =
    questionnaireDraft ??
    (selectedActividad?.type === "cuestionario" && isCuestionarioPayload(selectedActividad.payload)
      ? selectedActividad.payload
      : null);

  const title =
    (payload as CuestionarioPayload | null)?.activityTitle?.trim() ||
    selectedActividad?.title ||
    "Actividad EduGuias";
  const subject = selectedActividad?.subject ?? "General";

  const handleDownloadHtml = async () => {
    if (!payload) {
      setErrorMessage("No hay contenido disponible para descargar.");
      return;
    }
    setDownloadingHtml(true);
    setErrorMessage(null);
    try {
      const html = generateHtmlActivity(payload, title, subject);
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_").toLowerCase()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setErrorMessage("No se pudo generar el archivo HTML. Inténtalo de nuevo.");
      console.error(e);
    } finally {
      setDownloadingHtml(false);
    }
  };

  const handleDownloadScorm = async () => {
    if (!payload) {
      setErrorMessage("No hay contenido disponible para descargar.");
      return;
    }
    setDownloadingScorm(true);
    setErrorMessage(null);
    try {
      const blob = await generateScormPackage(payload, title, subject);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_").toLowerCase()}_scorm.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      setErrorMessage("No se pudo generar el paquete SCORM. Asegúrate de que el contenido esté guardado.");
      console.error(e);
    } finally {
      setDownloadingScorm(false);
    }
  };

  return (
    <div className=" flex flex-col gap-6 sm:gap-8">
      {/* Hero banner */}
      <section className="relative overflow-hidden rounded-3xl bg-[#135BEC] px-8 py-10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-16 -left-20 h-56 w-56 rounded-full bg-[#8CB3FF] blur-3xl" />
          <div className="absolute top-6 right-20 h-44 w-44 rounded-full bg-[#6FA6FF] blur-3xl" />
          <div className="absolute -bottom-20 left-44 h-64 w-64 rounded-full bg-[#2E7CFF] blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 font-lexend text-xs font-bold uppercase tracking-[1px] text-white">
              Completado
            </span>
            <h1 className="mt-4 font-lexend text-4xl font-extrabold text-white tracking-tight leading-tight">
              Listo para descargar
            </h1>
            <p className="mt-2 font-lexend text-lg leading-relaxed text-[#DBEAFE]">
              <span className="font-semibold text-white">{title}</span> está optimizada y accesible para tus estudiantes.
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-full border-8 border-[rgba(147,197,253,0.55)]">
            <svg width="56" height="56" viewBox="0 0 88 88" fill="none">
              <path d="M66 27L37 56L22 41" stroke="#BFDBFE" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      {/* Activity summary */}
      {payload && (
        <section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
          <p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">Resumen de la actividad</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Preguntas", value: payload.questions.length },
              { label: "Con imágenes", value: payload.questions.filter((q) => q.imageUrl).length },
              { label: "Retroalimentación", value: payload.feedbackMode === "per-question" ? "Por pregunta" : "Al finalizar" },
              { label: "Materia", value: subject },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="font-lexend text-xl font-bold text-[#0F172A]">{item.value}</p>
                <p className="font-lexend text-xs text-[#94A3B8] mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="#EF4444" strokeWidth="1.5" />
            <path d="M9 5.5V9.5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="12" r="0.75" fill="#EF4444" />
          </svg>
          <p className="font-lexend text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      {!payload && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5L16.5 15H1.5L9 1.5Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M9 7.5V10.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="12.75" r="0.75" fill="#D97706" />
          </svg>
          <p className="font-lexend text-sm text-amber-700">
            Guarda tu actividad desde la sección de Evaluación antes de descargar.
          </p>
        </div>
      )}

      {/* Download cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DownloadOptionCard
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3.5 4.5C3.5 3.948 3.948 3.5 4.5 3.5H17.5C18.052 3.5 18.5 3.948 18.5 4.5V17.5C18.5 18.052 18.052 18.5 17.5 18.5H4.5C3.948 18.5 3.5 18.052 3.5 17.5V4.5Z" stroke="#F97316" strokeWidth="1.8" />
              <path d="M6.5 8H15.5M6.5 11H12.5M6.5 14H14" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
          title="Descargar como HTML"
          description="Archivo único autocontenido con toda la lógica, estilos e interacciones. Compatible con cualquier servidor web o plataforma LMS que soporte contenido web estático."
          badge="Recomendado"
          onClick={handleDownloadHtml}
          loading={downloadingHtml}
        />

        <DownloadOptionCard
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="4" y="5" width="14" height="12" rx="2" stroke="#7C3AED" strokeWidth="1.8" />
              <path d="M8 3.5H14" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 10H14M8 13H12" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
          title="Descargar como SCORM"
          description="Paquete ZIP compatible con Moodle, Canvas y Blackboard. Incluye imsmanifest.xml y reporta calificaciones y progreso al LMS mediante la API SCORM 1.2."
          onClick={handleDownloadScorm}
          loading={downloadingScorm}
        />
      </section>
    </div>
  );
}
