"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import TemplateCard from "@/components/TemplateCard";
import { usePlantillasStore } from "@/stores/plantillasStore";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { toEditorActivityType } from "@/constants/activityTypes";
import { generateHtmlActivity } from "@/utils/generateHtml";
import { generateScormPackage } from "@/utils/generateScorm";
import type {
  ActivityType,
  CreateActividadInput,
  CuestionarioPayload,
} from "@/interfaces/actividades";
import type { Plantilla } from "@/services/plantillasServices";

const isCuestionarioPayload = (value: unknown): value is CuestionarioPayload => {
  if (!value || typeof value !== "object") return false;
  const c = value as CuestionarioPayload;
  return Array.isArray(c.questions) && typeof c.instructions === "string";
};

const slugifyFileName = (value: string) =>
  value.trim().replace(/\s+/g, "_").toLowerCase() || "actividad";

const ACTIVITY_STYLES: Record<
  string,
  {
    gradient: string;
    iconColor: string;
    badgeBg: string;
    badgeTextColor: string;
  }
> = {
  cuestionario: {
    gradient: "linear-gradient(135deg, rgba(19,91,236,0.20) 0%, rgba(96,165,250,0.20) 100%)",
    iconColor: "#135BEC",
    badgeBg: "#DBEAFE",
    badgeTextColor: "#2563EB",
  },
  "union-conceptos": {
    gradient: "linear-gradient(135deg, rgba(99,102,241,0.20) 0%, rgba(19,91,236,0.20) 100%)",
    iconColor: "#6366F1",
    badgeBg: "#F3E8FF",
    badgeTextColor: "#9333EA",
  },
  lectura: {
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.20) 0%, rgba(236,72,153,0.20) 100%)",
    iconColor: "#9333EA",
    badgeBg: "#FEF3C7",
    badgeTextColor: "#D97706",
  },
  "video-guia": {
    gradient: "linear-gradient(135deg, rgba(251,191,36,0.20) 0%, rgba(249,115,22,0.20) 100%)",
    iconColor: "#D97706",
    badgeBg: "#FFE4E6",
    badgeTextColor: "#E11D48",
  },
  "verdadero-falso": {
    gradient: "linear-gradient(135deg, rgba(34,197,94,0.20) 0%, rgba(45,212,191,0.20) 100%)",
    iconColor: "#0D9488",
    badgeBg: "#CCFBF1",
    badgeTextColor: "#0D9488",
  },
};

const DEFAULT_STYLE = {
  gradient: "linear-gradient(135deg, rgba(148,163,184,0.20) 0%, rgba(71,85,105,0.20) 100%)",
  iconColor: "#475569",
  badgeBg: "#E2E8F0",
  badgeTextColor: "#334155",
};

const TYPE_LABELS: Record<string, string> = {
  cuestionario: "CUESTIONARIO",
  "union-conceptos": "UNION DE CONCEPTOS",
  lectura: "LECTURA",
  "video-guia": "VIDEO GUIA",
  "verdadero-falso": "VERDADERO - FALSO",
};

const normalizeType = (value: string) => value.trim().toLowerCase();

export default function Plantillas() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Todas las áreas");
  const [searchQuery, setSearchQuery] = useState("");
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [previewTpl, setPreviewTpl] = useState<Plantilla | null>(null);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadingScorm, setDownloadingScorm] = useState(false);
  const plantillas = usePlantillasStore((state) => state.plantillas);
  const loading = usePlantillasStore((state) => state.loading);
  const error = usePlantillasStore((state) => state.error);
  const fetched = usePlantillasStore((state) => state.fetched);
  const fetchPlantillas = usePlantillasStore((state) => state.fetchPlantillas);
  const createActividad = useActividadesStore((state) => state.createActividad);
  const user = useAuthStore((state) => state.user);
  const setGlobalModal = useUiStore((state) => state.setGlobalModal);

  useEffect(() => {
    fetchPlantillas().catch(() => undefined);
  }, [fetchPlantillas]);

  const handleVerPlantilla = async (tpl: Plantilla) => {
    if (!user?.uid) {
      setPreviewTpl(tpl);
      return;
    }

    if (creatingId) return;
    setCreatingId(tpl.id);
    try {
      const editorType = toEditorActivityType(tpl.activityType);
      const nueva = await createActividad(user.uid, {
        type: editorType as ActivityType,
        subject: tpl.category,
        title: tpl.title,
        payload: tpl.content,
      } as CreateActividadInput);
      router.push(`/mis-actividades/${editorType}?actividadId=${nueva.id}`);
    } catch {
      setGlobalModal({
        visible: true,
        titulo: "No se pudo abrir la plantilla",
        descripcion:
          "Ocurrió un error al crear tu copia de la plantilla. Inténtalo de nuevo.",
        onClose: () => setGlobalModal({ visible: false }),
      });
      setCreatingId(null);
    }
  };

  const previewPayload =
    previewTpl && isCuestionarioPayload(previewTpl.content)
      ? previewTpl.content
      : null;
  const previewHtml = useMemo(() => {
    if (!previewTpl || !previewPayload) return null;
    return generateHtmlActivity(
      previewPayload,
      previewTpl.title,
      previewTpl.category
    );
  }, [previewTpl, previewPayload]);

  const closePreview = () => {
    setPreviewTpl(null);
    setDownloadingHtml(false);
    setDownloadingScorm(false);
  };

  const handleDownloadHtml = () => {
    if (!previewTpl || !previewHtml) return;
    setDownloadingHtml(true);
    try {
      const blob = new Blob([previewHtml], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugifyFileName(previewTpl.title)}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingHtml(false);
    }
  };

  const handleDownloadScorm = async () => {
    if (!previewTpl || !previewPayload) return;
    setDownloadingScorm(true);
    try {
      const blob = await generateScormPackage(
        previewPayload,
        previewTpl.title,
        previewTpl.category
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugifyFileName(previewTpl.title)}_scorm.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloadingScorm(false);
    }
  };

  const categories = useMemo(() => {
    const unique = new Set(plantillas.map((tpl) => tpl.category).filter(Boolean));
    return ["Todas las áreas", ...Array.from(unique)];
  }, [plantillas]);

  const filteredTemplates = useMemo(() => {
    return plantillas.filter((tpl) => {
      const byCategory =
        activeCategory === "Todas las áreas" || tpl.category === activeCategory;
      const query = searchQuery.trim().toLowerCase();
      const bySearch =
        query.length === 0 ||
        tpl.title.toLowerCase().includes(query) ||
        tpl.description.toLowerCase().includes(query) ||
        tpl.category.toLowerCase().includes(query);

      return byCategory && bySearch;
    });
  }, [activeCategory, plantillas, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F6F6F8] font-[Lexend]">
      <main className="max-w-360 mx-auto px-6 lg:px-38.5 py-12">
        <div className="mb-8">
          <h1 className="font-[Lexend] text-[36px] font-black text-[#0F172A] leading-tight tracking-[-1.188px] mb-2">
            Plantillas
          </h1>
          <p className="font-[Lexend] text-base font-normal text-[#475569] leading-6">
            Navega por nuestra selección de plantillas con actividades completas y listas para uso inmediato.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por tema o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full font-[Lexend] text-base text-[#6B7280] placeholder-[#6B7280] bg-white border border-slate-200 rounded-xl px-4 py-3.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full font-[Lexend] text-sm font-medium leading-5 transition-colors border ${
                  isActive
                    ? "bg-[#135BEC] text-white border-[#135BEC]"
                    : "bg-white text-[#475569] border-slate-200 hover:border-slate-300"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-[#64748B] mb-8">
            Cargando plantillas...
          </div>
        ) : null}

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600 mb-8">
            {error}
          </div>
        ) : null}

        {fetched && !loading && !error ? (
          filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredTemplates.map((tpl) => {
                const typeKey = normalizeType(tpl.activityType);
                const style = ACTIVITY_STYLES[typeKey] ?? DEFAULT_STYLE;

                return (
                  <TemplateCard
                    key={tpl.id}
                    gradient={style.gradient}
                    iconColor={style.iconColor}
                    badgeLabel={TYPE_LABELS[typeKey] ?? tpl.activityType.toUpperCase()}
                    badgeBg={style.badgeBg}
                    badgeTextColor={style.badgeTextColor}
                    category={tpl.category}
                    title={tpl.title}
                    description={tpl.description}
                    onClick={() => handleVerPlantilla(tpl)}
                    loading={creatingId === tpl.id}
                  />
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-[#64748B] mb-12">
              No hay plantillas disponibles para el filtro actual.
            </div>
          )
        ) : null}

        <div className="flex flex-col items-center gap-2">
          <p className="font-[Lexend] text-sm text-[#64748B] leading-5">
            Mostrando {filteredTemplates.length} de {plantillas.length} plantillas disponibles
          </p>
        </div>
      </main>

      {previewTpl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreview();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Vista previa de ${previewTpl.title}`}
            className="flex w-full max-w-3xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="font-[Lexend] text-xl font-bold text-[#0F172A]">
                  {previewTpl.title}
                </h2>
                <p className="font-[Lexend] text-sm text-[#64748B]">
                  {previewTpl.category}
                </p>
              </div>
              <button
                onClick={closePreview}
                aria-label="Cerrar vista previa"
                className="shrink-0 rounded-lg p-2 text-[#64748B] hover:bg-slate-100 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-[#F6F6F8] p-4">
              {previewHtml ? (
                <iframe
                  title={`Vista previa de ${previewTpl.title}`}
                  srcDoc={previewHtml}
                  className="h-[55vh] w-full rounded-xl border border-slate-200 bg-white"
                />
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-[Lexend] text-sm text-amber-700">
                  Esta plantilla no tiene contenido disponible para previsualizar.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                onClick={handleDownloadHtml}
                disabled={!previewHtml || downloadingHtml}
                className="font-[Lexend] text-sm font-semibold text-[#135BEC] bg-white border border-[#135BEC] rounded-xl px-6 py-3 hover:bg-blue-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingHtml ? "Descargando..." : "Descargar HTML"}
              </button>
              <button
                onClick={handleDownloadScorm}
                disabled={!previewPayload || downloadingScorm}
                className="font-[Lexend] text-sm font-semibold text-white bg-[#135BEC] rounded-xl px-6 py-3 hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {downloadingScorm ? "Generando..." : "Descargar SCORM"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
