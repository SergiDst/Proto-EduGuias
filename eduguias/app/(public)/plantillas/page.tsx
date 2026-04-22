"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateCard from "@/components/TemplateCard";
import { usePlantillasStore } from "@/stores/plantillasStore";

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
  const [activeCategory, setActiveCategory] = useState("Todas las áreas");
  const [searchQuery, setSearchQuery] = useState("");
  const plantillas = usePlantillasStore((state) => state.plantillas);
  const loading = usePlantillasStore((state) => state.loading);
  const error = usePlantillasStore((state) => state.error);
  const fetched = usePlantillasStore((state) => state.fetched);
  const fetchPlantillas = usePlantillasStore((state) => state.fetchPlantillas);

  useEffect(() => {
    fetchPlantillas().catch(() => undefined);
  }, [fetchPlantillas]);

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
    </div>
  );
}
