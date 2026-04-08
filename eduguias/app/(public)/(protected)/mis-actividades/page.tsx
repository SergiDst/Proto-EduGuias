"use client";

import { useState } from "react";

/* ── Type badge colors ── */
const typeBadgeStyle: Record<string, string> = {
  CUESTIONARIO: "bg-blue-100 text-brand",
  "UNION DE CONCEPTOS": "bg-amber-100 text-amber-700",
  LECTURA: "bg-yellow-100 text-yellow-700",
  "VIDEO GUIA": "bg-red-100 text-red-500",
  "VERDADERO - FALSO": "bg-emerald-100 text-emerald-700",
};

/* ── Activity card icons ── */
const QuizCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConceptCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ReadingCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VideoCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrueFalseCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const iconMap: Record<string, React.ReactNode> = {
  CUESTIONARIO: <QuizCardIcon />,
  "UNION DE CONCEPTOS": <ConceptCardIcon />,
  LECTURA: <ReadingCardIcon />,
  "VIDEO GUIA": <VideoCardIcon />,
  "VERDADERO - FALSO": <TrueFalseCardIcon />,
};

const scoreColor = (score: number) => {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-400";
  return "bg-red-500";
};
const scoreTextColor = (score: number) => {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  return "text-red-500";
};

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

/* ── Filter dropdown ── */
function FilterDropdown({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-edu-light bg-white font-lexend font-medium text-sm text-edu-dark hover:border-brand/40 transition-colors">
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="m19 9-7 7-7-7" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

/* ── Pagination ── */
function Pagination() {
  const pages = [1, 2, 3, "...", 5];
  return (
    <div className="flex items-center gap-1">
      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-edu-light bg-white text-edu-muted hover:border-brand/40 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i} className="w-8 h-8 flex items-center justify-center font-lexend text-sm text-edu-muted">…</span>
        ) : (
          <button
            key={i}
            className={`w-8 h-8 flex items-center justify-center rounded-lg font-lexend font-semibold text-sm transition-colors ${
              p === 1
                ? "bg-brand text-white"
                : "border border-edu-light bg-white text-edu-muted hover:border-brand/40"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-edu-light bg-white text-edu-muted hover:border-brand/40 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* ── Activity card ── */
function ActivityCard({ activity }: { activity: (typeof activities)[0] }) {
  const badgeClass = typeBadgeStyle[activity.type] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white rounded-2xl border border-edu-light overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Icon area */}
      <div className="bg-edu-bg flex items-center justify-center py-10">
        {iconMap[activity.type]}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-lexend font-semibold text-[11px] tracking-wide uppercase px-2 py-0.5 rounded-md ${badgeClass}`}>
            {activity.type}
          </span>
          <span className="font-lexend font-normal text-xs px-2 py-0.5 rounded-md bg-edu-bg text-edu-muted border border-edu-light">
            {activity.subject}
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-0.5">
          <h3 className="font-lexend font-bold text-base text-edu-dark leading-snug">
            {activity.title}
          </h3>
          <p className="font-lexend font-normal text-xs text-edu-muted">
            Ultima modificación: {activity.lastModified}
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col gap-1.5 mt-auto pt-2">
          <div className="flex items-center justify-between">
            <span className="font-lexend font-semibold text-xs text-edu-muted">
              Puntaje de accesibilidad
            </span>
            <span className={`font-lexend font-bold text-xs ${scoreTextColor(activity.score)}`}>
              {activity.score}%
            </span>
          </div>
          <div className="h-1.5 bg-edu-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${scoreColor(activity.score)}`}
              style={{ width: `${activity.score}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
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