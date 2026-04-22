"use client";

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
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ConceptCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ReadingCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const VideoCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrueFalseCardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
      stroke="#94A3B8"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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

interface Activity {
  id: string | number;
  type: string;
  subject: string;
  title: string;
  lastModified: string;
  score: number;
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const badgeClass = typeBadgeStyle[activity.type] ?? "bg-gray-100 text-gray-600";

  return (
    <article className="bg-white rounded-2xl border border-edu-light overflow-hidden flex flex-col hover:shadow-md focus-within:ring-2 focus-within:ring-brand focus-within:ring-offset-2 transition-shadow">
      {/* Icon area */}
      <div className="bg-edu-bg flex items-center justify-center py-10" aria-hidden="true">
        {iconMap[activity.type]}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-lexend font-semibold text-[11px] tracking-wide uppercase px-2 py-0.5 rounded-md ${badgeClass}`}
            role="doc-subtitle"
          >
            {activity.type}
          </span>
          <span className="font-lexend font-normal text-xs px-2 py-0.5 rounded-md bg-edu-bg text-edu-dark border border-edu-light">
            {activity.subject}
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-0.5">
          <h2 className="font-lexend font-bold text-base text-edu-dark leading-snug">
            {activity.title}
          </h2>
          <p className="font-lexend font-normal text-xs text-edu-dark">
            Última modificación: {activity.lastModified}
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col gap-1.5 mt-auto pt-2">
          <div className="flex items-center justify-between">
            <span className="font-lexend font-semibold text-xs text-edu-dark">
              Puntaje de accesibilidad
            </span>
            <span
              className={`font-lexend font-bold text-xs ${scoreTextColor(activity.score)}`}
              role="status"
              aria-label={`Puntaje: ${activity.score} por ciento`}
            >
              {activity.score}%
            </span>
          </div>
          <div className="h-1.5 bg-edu-light rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${scoreColor(activity.score)}`}
              style={{ width: `${activity.score}%` }}
              role="progressbar"
              aria-valuenow={activity.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Barra de progreso: ${activity.score}%`}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
