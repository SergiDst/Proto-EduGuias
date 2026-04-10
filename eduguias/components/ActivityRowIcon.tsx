"use client";

export function ActivityRowIcon({ type }: { type: string }) {
  const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
    Cuestionario: {
      bg: "bg-blue-100",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    "Union de conceptos": {
      bg: "bg-amber-100",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    "Video guia": {
      bg: "bg-violet-100",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  };
  const s = styles[type] ?? styles["Cuestionario"];
  return (
    <div className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
      {s.icon}
    </div>
  );
}
