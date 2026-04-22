interface DescargaStepProps {
  onDownloadHtml?: () => void;
  onDownloadScorm?: () => void;
}

function DownloadOptionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-sm flex flex-col">
      <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#EEF2FF] flex items-center justify-center">
        {icon}
      </div>

      <h3 className="mt-6 font-lexend text-[38px] leading-[1.05] font-bold text-[#1E293B] tracking-[-0.6px]">
        {title}
      </h3>

      <p className="mt-4 font-lexend text-base leading-7 text-[#64748B] min-h-34">
        {description}
      </p>

      <button
        onClick={onClick}
        className="mt-8 h-12 rounded-xl bg-[#135BEC] text-white font-lexend text-lg font-bold hover:bg-[#0f4fd1] transition-colors"
      >
        Descargar
      </button>
    </div>
  );
}

export function DescargaStep({ onDownloadHtml, onDownloadScorm }: DescargaStepProps) {
  return (
    <div className="p-8 flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-3xl bg-[#135BEC] px-8 py-10">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-16 -left-20 h-56 w-56 rounded-full bg-[#8CB3FF] blur-3xl" />
          <div className="absolute top-6 right-20 h-44 w-44 rounded-full bg-[#6FA6FF] blur-3xl" />
          <div className="absolute -bottom-20 left-44 h-64 w-64 rounded-full bg-[#2E7CFF] blur-3xl" />
        </div>

        <div className="relative flex items-center justify-between gap-8">
          <div className="max-w-200">
            <span className="inline-flex rounded-full bg-[rgba(255,255,255,0.2)] px-3 py-1 font-lexend text-xs font-bold uppercase tracking-[1px] text-white">
              Completado
            </span>
            <h1 className="mt-4 font-lexend text-[56px] leading-[1.05] font-extrabold text-white tracking-[-1.2px]">
              Listo para descargar
            </h1>
            <p className="mt-3 font-lexend text-[30px] leading-[1.35] text-[#DBEAFE] max-w-175">
              Tu experiencia de aprendizaje interactiva esta completamente optimizada, accesible y lista para tus estudiantes.
            </p>
          </div>

          <div className="hidden md:flex items-center justify-center w-44 h-44 rounded-full border-8 border-[rgba(147,197,253,0.55)]">
            <svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M66 27L37 56L22 41" stroke="#BFDBFE" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DownloadOptionCard
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 4.5C3.5 3.94772 3.94772 3.5 4.5 3.5H17.5C18.0523 3.5 18.5 3.94772 18.5 4.5V17.5C18.5 18.0523 18.0523 18.5 17.5 18.5H4.5C3.94772 18.5 3.5 18.0523 3.5 17.5V4.5Z" stroke="#F97316" strokeWidth="1.8" />
              <path d="M6.5 8H15.5M6.5 11H12.5M6.5 14H14" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
          title="Descargar como HTML"
          description="Obten un unico archivo index que contenga toda la logica, el estilo y las interacciones. Incluye JS y CSS incrustados para su uso independiente en cualquier servidor web."
          onClick={onDownloadHtml}
        />

        <DownloadOptionCard
          icon={
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="5" width="14" height="12" rx="2" stroke="#7C3AED" strokeWidth="1.8" />
              <path d="M8 3.5H14" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M8 10H14M8 13H12" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
          title="Descargar como SCORM"
          description="Compatible con Moodle, Canvas y Blackboard. Paquete ZIP listo para subir con archivos manifest para el seguimiento del progreso y las calificaciones."
          onClick={onDownloadScorm}
        />
      </section>
    </div>
  );
}