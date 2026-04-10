interface TemplateCardProps {
  gradient: string;
  iconColor: string;
  badgeLabel: string;
  badgeBg: string;
  badgeTextColor: string;
  category: string;
  title: string;
  description: string;
}

/** Generic template/document SVG used across all cards */
function CardIcon({ color }: { color: string }) {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="8" y="4" width="30" height="38" rx="3" stroke={color} strokeWidth="2.5" fill="none"/>
      <rect x="14" y="4" width="30" height="38" rx="3" stroke={color} strokeWidth="2.5" fill="none" opacity="0.5"/>
      <line x1="14" y1="17" x2="32" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="23" x2="32" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <line x1="14" y1="29" x2="26" y2="29" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="48" r="4" fill={color} opacity="0.6"/>
      <circle cx="22" cy="51" r="3" fill={color} opacity="0.4"/>
      <circle cx="33" cy="49" r="3.5" fill={color} opacity="0.5"/>
    </svg>
  );
}

export default function TemplateCard({ gradient, iconColor, badgeLabel, badgeBg, badgeTextColor, category, title, description,}: TemplateCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Card image / icon area */}
      <div
        className="flex h-48 items-center justify-center shrink-0"
        style={{ background: gradient }}
      >
        <div className="opacity-50">
          <CardIcon color={iconColor} />
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="inline-flex items-center px-2 py-1 rounded text-[10px] font-semibold tracking-[0.5px] uppercase leading-none"
            style={{ background: badgeBg, color: badgeTextColor }}
          >
            {badgeLabel}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[#475569] text-xs font-medium leading-4">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-[Lexend] text-lg font-bold text-[#0F172A] leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="font-[Lexend] text-sm text-[#64748B] leading-5 flex-1">
          {description}
        </p>

        {/* CTA button */}
        <div className="flex justify-center mt-2">
          <button className="font-[Lexend] text-base font-semibold text-white bg-[#135BEC] rounded-xl px-8 py-3 leading-6 hover:bg-blue-700 transition-colors shadow-[0_10px_15px_-3px_rgba(19,91,236,0.20),0_4px_6px_-4px_rgba(19,91,236,0.20)]">
            Ver plantilla
          </button>
        </div>
      </div>
    </div>
  );
}