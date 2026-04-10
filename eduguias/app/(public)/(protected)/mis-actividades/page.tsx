"use client";

import { useState } from "react";
import { FilterDropdown } from "@/components/FilterDropdown";
import { Pagination } from "@/components/Pagination";
import { ActivityCard } from "@/components/ActivityCard";

/* ── Data ── */
const activities = [
  {
    id: 1,
    type: "CUESTIONARIO",
    subject: "Ciencias",
    title: "Introdución a termodinamica",
    lastModified: "Oct 24, 2023",
    score: 92,
  },
  {
    id: 2,
    type: "UNION DE CONCEPTOS",
    subject: "Humanidades",
    title: "Ecosistema de interdependencias",
    lastModified: "Oct 21, 2023",
    score: 68,
  },
  {
    id: 3,
    type: "LECTURA",
    subject: "Sociales",
    title: "Historia de la Revolución industrial",
    lastModified: "Oct 15, 2023",
    score: 42,
  },
  {
    id: 4,
    type: "VIDEO GUIA",
    subject: "Matematicas",
    title: "Explicación de expresiones algebraicas",
    lastModified: "Oct 12, 2023",
    score: 88,
  },
  {
    id: 5,
    type: "VERDADERO - FALSO",
    subject: "Ciencias",
    title: "Mitos y verdades de la energía renovable",
    lastModified: "Oct 08, 2023",
    score: 95,
  },
];

export default function MisActividades() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-edu-bg font-lexend">
      <main className="max-w-300 mx-auto px-6 lg:px-10 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex flex-col gap-1">
            <h1 className="font-lexend font-extrabold text-4xl text-edu-dark">
              Mis actividades
            </h1>
            <p className="font-lexend font-normal text-base text-edu-muted">
              Gestiona, edita y monitorea la accesibilidad de tus materiales educativos.
            </p>
          </div>
          <button className="flex items-center gap-1.5 bg-brand text-white font-lexend font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 4.5v15m7.5-7.5h-15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Crear actividad
          </button>
        </div>

        {/* Filters bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <FilterDropdown label="Tipo: Todos" />
            <FilterDropdown label="Area: Todas" />
            <FilterDropdown label="Puntaje: Cualquiera" />
          </div>

          {/* View toggle */}
          <div className="flex items-center border border-edu-light bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-edu-light text-edu-dark" : "text-edu-muted hover:bg-edu-bg"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-edu-light text-edu-dark" : "text-edu-muted hover:bg-edu-bg"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="font-lexend font-normal text-sm text-edu-muted">
            Mostrando 1 de 1 paginas
          </span>
          <Pagination />
        </div>
      </main>
    </div>
  );
}