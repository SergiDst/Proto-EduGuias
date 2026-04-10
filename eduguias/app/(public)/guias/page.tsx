import { ShieldIcon, PdfIcon, ExternalLinkIcon, DocIcon } from "@/components/GuiasIcons";
import { ResourceCard, ResourceCardProps } from "@/components/ResourceCard";

/* ── Resource data ── */
const resources: ResourceCardProps[] = [
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
