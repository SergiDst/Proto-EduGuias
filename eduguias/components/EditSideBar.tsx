type CardType = "WCAG" | "UDL" | "Clarity";

interface AssistantCard {
    id: CardType;
    title: string;
    body: string;
}

const cardTypeStyles: Record<CardType, { icon: React.ReactNode; bgClass: string; titleColor: string; bodyColor: string }> = {
    WCAG: {
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1.5L16.5 15H1.5L9 1.5Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7.5V10.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="12.75" r="0.75" fill="#D97706" />
            </svg>
        ),
        bgClass: "bg-amber-50 border-amber-200",
        titleColor: "text-amber-700",
        bodyColor: "text-amber-800",
    },
    UDL: {
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="7.5" stroke="#135BEC" strokeWidth="1.5" />
                <path d="M9 8.25V13.5" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="5.625" r="0.875" fill="#135BEC" />
            </svg>
        ),
        bgClass: "bg-blue-50 border-blue-200",
        titleColor: "text-[#135BEC]",
        bodyColor: "text-blue-800",
    },
    Clarity: {
        icon: (
            <svg width="18" height="18" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.75 22.5L5 17.75V10.25L0 7.5L13.75 0L27.5 7.5V17.5H25V8.875L22.5 10.25V17.75L13.75 22.5ZM13.75 12.125L22.3125 7.5L13.75 2.875L5.1875 7.5L13.75 12.125ZM13.75 19.6562L20 16.2812V11.5625L13.75 15L7.5 11.5625V16.2812L13.75 19.6562Z" fill="#135BEC" />
            </svg>
        ),
        bgClass: "bg-white border-slate-200",
        titleColor: "text-[#0F172A]",
        bodyColor: "text-[#475569]",
    },
};

/* const assistantCards: AssistantCard[] = [
  {
    id: "WCAG",
    title: "Texto alternativo faltante",
    body: "Sube una imagen. Recuerda añadir un texto alternativo para los lectores de pantallas. Así todos los usuarios podran entender el contexto de la imagen.",
  },
  {
    id: "UDL",
    title: "Principio UDL",
    body: (
      <>
        <span className="font-bold text-[#135BEC]">Múltiples formas de representación:</span>
        {" "}Considere agregar una descripción de audio o una transcripción de texto para esta pregunta para apoyar diversos estilos de aprendizaje.
      </>
    ),
  },
  {
    id: "Clarity",
    title: "Consejo de claridad",
    body: "Asegúrate de que tus opciones distractoras (respuestas incorrectas) sean plausibles para medir eficazmente la comprensión del estudiante.",
  },
]; */

export default function EditSideBar({ assistantOpen, setAssistantOpen, assistantCards }: { assistantOpen: boolean; setAssistantOpen: (open: boolean) => void; assistantCards?: AssistantCard[] }) {
    //const cards = propAssistantCards || assistantCards;
    return (
        <aside className={`shrink-0 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 overflow-hidden ${assistantOpen ? "w-70" : "w-12"}`}
        >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100 shrink-0">
                {assistantOpen && (
                    <div className="flex items-center gap-2 min-w-0">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="7.5" stroke="#135BEC" strokeWidth="1.5" />
                            <path d="M9 8.25V13.5" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" />
                            <circle cx="9" cy="5.625" r="0.875" fill="#135BEC" />
                        </svg>
                        <div className="min-w-0">
                            <p className="font-[Lexend] text-xs font-bold text-[#135BEC] tracking-[0.5px] uppercase leading-none">
                                Asistente
                            </p>
                            <p className="font-[Lexend] text-[11px] text-[#64748B] mt-0.5 truncate">
                                Asistente de accesibilidad y pedagogia
                            </p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setAssistantOpen(!assistantOpen)}
                    className={`shrink-0 text-[#94A3B8] hover:text-[#475569] transition-colors ${assistantOpen ? "" : "mx-auto"
                        }`}
                    title={assistantOpen ? "Cerrar asistente" : "Abrir asistente"}
                >
                    <svg
                        width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                        className={`transition-transform duration-300 ${assistantOpen ? "" : "rotate-180"}`}
                    >
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Cards */}
            {assistantOpen && (
                <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
                    {assistantCards ?
                        assistantCards?.map((card) => {
                            const styles = cardTypeStyles[card.id];
                            return (
                                <div
                                    key={card.id}
                                    className={`rounded-xl border p-4 ${styles.bgClass}`}
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <span className="shrink-0 mt-0.5">{styles.icon}</span>
                                        <p className={`font-[Lexend] text-[13px] font-bold leading-snug ${styles.titleColor}`}>
                                            {card.title}
                                        </p>
                                    </div>
                                    <p className={`font-[Lexend] text-[12px] leading-[1.6] ${styles.bodyColor}`}>
                                        {card.body}
                                    </p>
                                </div>
                            );
                        })
                        : (
                            <div className="text-center py-10">
                                <p className="font-[Lexend] text-sm text-[#475569]">
                                    No hay sugerencias por el momento. ¡Buen trabajo!
                                </p>
                            </div>
                        )
                    }

                </div>
            )}
        </aside>
    )
}
