import type { ReactNode } from "react";

type CardType = "WCAG" | "UDL" | "Clarity";

interface AssistantCard {
    id: CardType;
    title: string;
    body: string;
}

const cardTypeStyles: Record<CardType, { icon: ReactNode; bgClass: string; titleColor: string; bodyColor: string }> = {
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

const paletteSwatches = ["#FFFFFF", "#F8FAFC", "#6B8795", "#FFF7D1", "#E4E4E7", "#7C8596", "#D6E2FF"];

const recommendedModes = [
    {
        title: "Modo lectura",
        body: "Ideal para sesiones de lectura prolongadas.",
        accentClass: "bg-slate-400",
        active: false,
    },
    {
        title: "Alto contraste",
        body: "Maxima legibilidad visual.",
        accentClass: "bg-slate-950",
        active: true,
    },
    {
        title: "Pastel suave",
        body: "Entorno relajante para el aprendizaje.",
        accentClass: "bg-blue-200",
        active: false,
    },
];

function PaletteSidebar() {
    return (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">


            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Tipografia</p>
                </div>

                <div className="space-y-3">
                    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                        Public Sans
                    </div>

                    {[
                        { label: "Tamano de los titulos", value: 20 },
                        { label: "Tamano de los subtitulos", value: 18 },
                        { label: "Tamano del texto", value: 16 },
                    ].map((item) => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">A</span>
                                <div className="relative h-1.5 flex-1 rounded-full bg-slate-200">
                                    <div
                                        className="absolute left-0 top-0 h-1.5 rounded-full bg-[#135BEC]"
                                        style={{ width: `${Math.max(45, item.value * 4)}%` }}
                                    />
                                    <div
                                        className="absolute top-[-5px] h-4 w-4 rounded-full border-2 border-[#135BEC] bg-white shadow-sm"
                                        style={{ left: `calc(${Math.max(45, item.value * 4)}% - 0.5rem)` }}
                                    />
                                </div>
                                <span className="text-sm font-bold text-slate-900">A</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Color de texto</p>
                <div className="flex items-center gap-2">
                    {paletteSwatches.slice(0, 5).map((color, index) => (
                        <button
                            key={color}
                            type="button"
                            className={`h-6 w-6 rounded-full border ${index === 0 ? "border-[#135BEC] ring-2 ring-[#135BEC]/20" : "border-slate-200"}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Color de texto ${index + 1}`}
                        />
                    ))}
                    <button type="button" className="grid h-6 w-6 place-items-center rounded-full border border-slate-200 text-[#94A3B8]">
                        <span className="text-sm leading-none">✎</span>
                    </button>
                </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Fondo de leccion</p>
                <div className="grid grid-cols-4 gap-2">
                    {paletteSwatches.map((color, index) => (
                        <button
                            key={color}
                            type="button"
                            className={`h-11 rounded-lg border ${index === 0 ? "border-[#135BEC] ring-2 ring-[#135BEC]/15" : "border-slate-200"}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Fondo ${index + 1}`}
                        />
                    ))}
                </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Modos recomendados</p>
                <div className="space-y-3">
                    {recommendedModes.map((mode) => (
                        <div
                            key={mode.title}
                            className={`rounded-xl border p-3 ${mode.active ? "border-[#135BEC] bg-[#EEF4FF]" : "border-slate-200 bg-white"}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white">
                                    <div className={`h-2 w-2 rounded-full ${mode.accentClass}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-bold text-slate-900">{mode.title}</p>
                                        {mode.active ? <span className="text-xs font-bold text-[#135BEC]">Activo</span> : null}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{mode.body}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function EditSideBar({
    assistantOpen,
    setAssistantOpen,
    assistantCards,
    seccionActual,
}: {
    assistantOpen: boolean;
    setAssistantOpen: (open: boolean) => void;
    assistantCards?: AssistantCard[];
    seccionActual?: string;
}) {
    const paletteMode = seccionActual === "paleta";

    return (
        <aside className={`shrink-0 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 overflow-hidden ${assistantOpen ? (paletteMode ? "w-[22rem]" : "w-70") : "w-12"}`}
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
                                {paletteMode ? "Personalizacion" : "Asistente"}
                            </p>
                            <p className="font-[Lexend] text-[11px] text-[#64748B] mt-0.5 truncate">
                                {paletteMode ? "Ajusta la apariencia visual de la actividad" : "Asistente de accesibilidad y pedagogia"}
                            </p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setAssistantOpen(!assistantOpen)}
                    className={`shrink-0 text-[#94A3B8] hover:text-[#475569] transition-colors ${assistantOpen ? "" : "mx-auto"
                        }`}
                    title={assistantOpen ? (paletteMode ? "Cerrar personalizacion" : "Cerrar asistente") : (paletteMode ? "Abrir personalizacion" : "Abrir asistente")}
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
            {assistantOpen && (paletteMode ? <PaletteSidebar /> : (
                <div className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
                    {assistantCards ?
                        assistantCards.map((card) => {
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
            ))}
        </aside>
    )
}
