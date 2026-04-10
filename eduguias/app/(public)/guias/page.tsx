/* ── Shield icon for hero ── */
const ShieldIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
      stroke="rgba(255,255,255,0.30)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ── Resource card icons ── */
const PdfIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const OpenExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Resource data ── */
const resources = [
  {
    id: 1,
    icon: <PdfIcon />,
    iconBg: "bg-red-50",
    meta: "2.4 MB",
    title: "UDL Guidelines (CAST)",
    description:
      "La guia de de diseño universal que te ayudara a mejorar y optimizar la...",
    action: "download",
    actionLabel: "Descargar PDF",
  },
  {
    id: 2,
    icon: <ExternalLinkIcon />,
    iconBg: "bg-blue-50",
    meta: "Enlace Externo",
    title: "WCAG 2.2 Quick Reference",
    description:
      "Sitio web oficial del Web Content Accessibility Guidelines...",
    action: "link",
    actionLabel: "Abrir referencia",
  },
  {
    id: 3,
    icon: <DocIcon />,
    iconBg: "bg-emerald-50",
    meta: "1.8 MB",
    title: "Principios de diseño inclusivos",
    description:
      "Un conjunto de siete principios que te ayudaran a crear actividades m...",
    action: "download",
    actionLabel: "Descargar PDF",
  },
];

/* ── Resource card ── */
function ResourceCard({ resource }: { resource: (typeof resources)[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-edu-light p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Top row: icon + meta */}
      <div className="flex items-start justify-between gap-2">
        <div className={`w-11 h-11 ${resource.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          {resource.icon}
        </div>
        <span className="font-lexend font-normal text-xs text-edu-muted mt-1">{resource.meta}</span>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1 flex-1">
        <h3 className="font-lexend font-bold text-base text-edu-dark">
          {resource.title}
        </h3>
        <p className="font-lexend font-normal text-sm text-edu-muted leading-snug">
          {resource.description}
        </p>
      </div>

      {/* Action button */}
      <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-edu-light bg-edu-bg font-lexend font-semibold text-sm text-edu-muted hover:border-brand/30 hover:text-brand transition-colors">
        {resource.action === "download" ? <DownloadIcon /> : <OpenExternalIcon />}
        {resource.actionLabel}
      </button>
    </div>
  );
}

/* ── Page ── */
export default function Guias() {
  return (
    <div className="min-h-screen bg-edu-bg font-lexend">

      <main className="max-w-300 mx-auto px-6 lg:px-10 py-10 flex flex-col gap-10">

        {/* Page heading */}
        <div className="flex flex-col gap-2">
          <h1 className="font-lexend font-extrabold text-4xl text-edu-dark">Guias</h1>
          <p className="font-lexend font-normal text-base text-edu-muted max-w-2xl">
            Explora los recursos seleccionados para implementar las mejores practicas para la educación inclusiva.
          </p>
        </div>

        {/* Featured hero card */}
        <div className="relative bg-brand rounded-2xl overflow-hidden px-10 py-12 flex items-center justify-between gap-8 min-h-70">
          {/* Left content */}
          <div className="flex flex-col gap-5 max-w-130 z-10">
            {/* Badge */}
            <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-white/20 font-lexend font-semibold text-xs tracking-widest text-white uppercase">
              Nueva guia
            </span>

            {/* Headline */}
            <h2 className="font-lexend font-extrabold text-3xl lg:text-4xl text-white leading-tight">
              Domina la Accesibilidad 2.2
            </h2>

            {/* Description */}
            <p className="font-lexend font-normal text-base text-white/85 leading-relaxed">
              Aprende como implementar los ultimos estandres WCAG en tus presentaciones digitales con nuestra guia completa.
            </p>

            {/* CTA */}
            <button className="self-start flex items-center gap-2 bg-white text-brand font-lexend font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors">
              Leer guia
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" stroke="#135BEC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Right illustration */}
          <div className="hidden md:flex items-center justify-center shrink-0 opacity-40">
            <ShieldIcon />
          </div>
        </div>

        {/* Recursos oficiales */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-lexend font-extrabold text-2xl text-edu-dark">
              Recursos oficiales
            </h2>
            <button className="font-lexend font-semibold text-sm text-brand hover:underline">
              Ver todos los documentos
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
