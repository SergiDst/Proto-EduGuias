import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import type {
    CuestionarioPayload,
    QuestionnaireFontFamily,
    QuestionnairePalette,
    QuestionnairePaletteMode,
} from "@/interfaces/actividades";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUiStore } from "@/stores/uiStore";

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

const textColorSwatches = ["#0F172A", "#1E293B", "#334155", "#475569", "#111827"];

const defaultPalette: QuestionnairePalette = {
    fontFamily: "inter",
    titleSize: 20,
    subtitleSize: 18,
    bodySize: 16,
    textColor: "#0F172A",
    backgroundColor: "#FFFFFF",
    mode: "alto-contraste",
};

const createDefaultDraft = (): CuestionarioPayload => ({
    objective: "",
    instructions: "",
    questions: [],
    feedbackMode: "per-question",
    showCorrectAnswers: true,
    generalMessage: "",
    palette: defaultPalette,
});

const isCuestionarioPayload = (value: unknown): value is CuestionarioPayload => {
    if (!value || typeof value !== "object") {
        return false;
    }

    const candidate = value as CuestionarioPayload;
    return Array.isArray(candidate.questions) && typeof candidate.instructions === "string";
};

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

const fontOptions: Array<{ id: QuestionnaireFontFamily; label: string; previewFont: string }> = [
    { id: "inter", label: "Inter", previewFont: "var(--font-inter), sans-serif" },
    { id: "roboto", label: "Roboto", previewFont: "var(--font-roboto), sans-serif" },
    { id: "source-sans-3", label: "Source Sans 3", previewFont: "var(--font-source-sans-3), sans-serif" },
];

function PaletteSidebar() {
    const selectedActividad = useActividadesStore((state) => state.selectedActividad);
    const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
    const setQuestionnaireDraft = useActividadesStore((state) => state.setQuestionnaireDraft);
    const [isFontAccordionOpen, setIsFontAccordionOpen] = useState(false);

    const sourceDraft = useMemo(() => {
        const payloadFromActividad =
            selectedActividad?.type === "cuestionario" && isCuestionarioPayload(selectedActividad.payload)
                ? selectedActividad.payload
                : null;

        return questionnaireDraft ?? payloadFromActividad ?? createDefaultDraft();
    }, [questionnaireDraft, selectedActividad]);

    const palette = sourceDraft.palette ?? defaultPalette;
    const selectedFontOption = fontOptions.find((fontOption) => fontOption.id === palette.fontFamily) ?? fontOptions[0];

    const updatePalette = (updater: (current: QuestionnairePalette) => QuestionnairePalette) => {
        const currentDraft = sourceDraft;
        const nextPalette = updater(currentDraft.palette ?? defaultPalette);

        setQuestionnaireDraft({
            ...currentDraft,
            palette: nextPalette,
        });
    };

    const updatePaletteSize = (field: "titleSize" | "subtitleSize" | "bodySize", value: number) => {
        updatePalette((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const modeLabel = (mode: QuestionnairePaletteMode) => {
        if (mode === "modo-lectura") return "Modo lectura";
        if (mode === "pastel-suave") return "Pastel suave";
        return "Alto contraste";
    };

    return (
        <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">


            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Tipografia</p>
                </div>

                <div className="space-y-3">
                    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={() => setIsFontAccordionOpen((current) => !current)}
                            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left"
                            aria-expanded={isFontAccordionOpen}
                            aria-label="Seleccionar fuente"
                        >
                            <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: selectedFontOption.previewFont }}>
                                {selectedFontOption.label}
                            </span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={`transition-transform ${isFontAccordionOpen ? "rotate-180" : ""}`}
                            >
                                <path d="M3.5 6L8 10L12.5 6" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {isFontAccordionOpen ? (
                            <div className="space-y-1 border-t border-slate-200 p-2">
                                {fontOptions.map((fontOption) => {
                                    const isActive = palette.fontFamily === fontOption.id;

                                    return (
                                        <button
                                            key={fontOption.id}
                                            type="button"
                                            onClick={() => {
                                                updatePalette((current) => ({
                                                    ...current,
                                                    fontFamily: fontOption.id,
                                                }));
                                                setIsFontAccordionOpen(false);
                                            }}
                                            className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${isActive ? "bg-[#EEF4FF] text-[#0F172A]" : "text-slate-700 hover:bg-slate-50"}`}
                                            style={{ fontFamily: fontOption.previewFont }}
                                        >
                                            {fontOption.label}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>

                    {[
                        { label: "Tamano de los titulos", value: palette.titleSize, key: "titleSize" as const },
                        { label: "Tamano de los subtitulos", value: palette.subtitleSize, key: "subtitleSize" as const },
                        { label: "Tamano del texto", value: palette.bodySize, key: "bodySize" as const },
                    ].map((item) => (
                        <div key={item.label} className="space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                            <input
                                type="range"
                                min={14}
                                max={30}
                                value={item.value}
                                onChange={(event) => updatePaletteSize(item.key, Number(event.target.value))}
                                className="h-2 w-full cursor-pointer accent-[#135BEC]"
                            />
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Color de texto</p>
                <div className="flex items-center gap-2">
                    {textColorSwatches.map((color, index) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() =>
                                updatePalette((current) => ({
                                    ...current,
                                    textColor: color,
                                }))
                            }
                            className={`h-6 w-6 rounded-full border ${palette.textColor === color ? "border-[#135BEC] ring-2 ring-[#135BEC]/20" : "border-slate-200"}`}
                            style={{ backgroundColor: color }}
                            aria-label={`Color de texto ${index + 1}`}
                        />
                    ))}
                    <input
                        type="color"
                        value={palette.textColor}
                        onChange={(event) =>
                            updatePalette((current) => ({
                                ...current,
                                textColor: event.target.value,
                            }))
                        }
                        className="h-6 w-6 cursor-pointer rounded-full border border-slate-200 p-0"
                        aria-label="Color personalizado de texto"
                    />
                </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-900">Fondo de leccion</p>
                <div className="grid grid-cols-4 gap-2">
                    {paletteSwatches.map((color, index) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() =>
                                updatePalette((current) => ({
                                    ...current,
                                    backgroundColor: color,
                                }))
                            }
                            className={`h-11 rounded-lg border ${palette.backgroundColor === color ? "border-[#135BEC] ring-2 ring-[#135BEC]/15" : "border-slate-200"}`}
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
                            className={`rounded-xl border p-3 ${palette.mode === (mode.title === "Modo lectura" ? "modo-lectura" : mode.title === "Pastel suave" ? "pastel-suave" : "alto-contraste") ? "border-[#135BEC] bg-[#EEF4FF]" : "border-slate-200 bg-white"}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white">
                                    <div className={`h-2 w-2 rounded-full ${mode.accentClass}`} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-sm font-bold text-slate-900">{mode.title}</p>
                                        {palette.mode === (mode.title === "Modo lectura" ? "modo-lectura" : mode.title === "Pastel suave" ? "pastel-suave" : "alto-contraste") ? <span className="text-xs font-bold text-[#135BEC]">Activo</span> : null}
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{mode.body}</p>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            updatePalette((current) => ({
                                                ...current,
                                                mode: mode.title === "Modo lectura" ? "modo-lectura" : mode.title === "Pastel suave" ? "pastel-suave" : "alto-contraste",
                                            }))
                                        }
                                        className="mt-2 text-xs font-semibold text-[#135BEC] hover:underline"
                                    >
                                        Aplicar {modeLabel(mode.title === "Modo lectura" ? "modo-lectura" : mode.title === "Pastel suave" ? "pastel-suave" : "alto-contraste")}
                                    </button>
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
    seccionActual,
    isDesktop = true,
}: {
    assistantOpen: boolean;
    setAssistantOpen: (open: boolean) => void;
    seccionActual?: string;
    isDesktop?: boolean;
}) {
    const paletteMode = seccionActual === "paleta";
    const microtips = useUiStore((state) => state.microtips);
    const dismissSidebarTip = useUiStore((state) => state.dismissSidebarTip);

    // Show tips that have been moved to sidebar and not dismissed
    const sidebarTips = microtips.filter((t) => t.movedToSidebar && !t.dismissed);

    // Width logic differs on mobile (full-width drawer) vs desktop (collapse rail)
    const desktopWidthClass = assistantOpen ? (paletteMode ? "lg:w-88" : "lg:w-70") : "lg:w-12";
    const mobileTransform = assistantOpen ? "translate-x-0" : "translate-x-full";

    return (
        <aside
            aria-label="Asistente y personalización"
            className={`fixed right-0 top-16 bottom-0 z-40 bg-white border-l border-slate-200 flex flex-col transition-all duration-300 overflow-hidden
                ${isDesktop ? `lg:translate-x-0 ${desktopWidthClass}` : `w-[min(20rem,90vw)] ${mobileTransform}`}`}
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
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-[Lexend] text-xs font-bold text-[#135BEC] tracking-[0.5px] uppercase leading-none">
                                    {paletteMode ? "Personalizacion" : "Asistente"}
                                </p>
                                {!paletteMode && sidebarTips.length > 0 && (
                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#135BEC] text-white font-bold text-[9px]">
                                        {sidebarTips.length}
                                    </span>
                                )}
                            </div>
                            <p className="font-[Lexend] text-[11px] text-[#64748B] mt-0.5 truncate">
                                {paletteMode ? "Ajusta la apariencia visual de la actividad" : "Asistente de accesibilidad y pedagogia"}
                            </p>
                        </div>
                    </div>
                )}
                <button
                    onClick={() => setAssistantOpen(!assistantOpen)}
                    className={`shrink-0 text-[#94A3B8] hover:text-[#475569] transition-colors relative ${assistantOpen ? "" : "mx-auto"}`}
                    title={assistantOpen ? (paletteMode ? "Cerrar personalizacion" : "Cerrar asistente") : (paletteMode ? "Abrir personalizacion" : "Abrir asistente")}
                    aria-label={assistantOpen ? (paletteMode ? "Cerrar personalización" : "Cerrar asistente") : (paletteMode ? "Abrir personalización" : "Abrir asistente")}
                    aria-expanded={assistantOpen}
                >
                    {!assistantOpen && !paletteMode && sidebarTips.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border-2 border-white" />
                    )}
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
                    {sidebarTips.length > 0 ? (
                        sidebarTips.map((tip) => {
                            const styles = cardTypeStyles[tip.type as CardType];
                            return (
                                <div
                                    key={tip.id}
                                    className={`rounded-xl border p-4 ${styles.bgClass} relative`}
                                >
                                    <button
                                        onClick={() => dismissSidebarTip(tip.id)}
                                        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
                                        aria-label="Descartar sugerencia"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                    <div className="flex items-start gap-2 mb-2 pr-4">
                                        <span className="shrink-0 mt-0.5">{styles.icon}</span>
                                        <p className={`font-[Lexend] text-[13px] font-bold leading-snug ${styles.titleColor}`}>
                                            {tip.title}
                                        </p>
                                    </div>
                                    <p className={`font-[Lexend] text-[12px] leading-[1.6] ${styles.bodyColor}`}>
                                        {tip.body}
                                    </p>
                                    <div className="mt-2">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                                            tip.type === "WCAG" ? "bg-amber-100 text-amber-700" :
                                            tip.type === "UDL" ? "bg-blue-100 text-blue-700" :
                                            "bg-slate-100 text-slate-600"
                                        }`}>
                                            {tip.section} · {tip.type}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-10 flex flex-col items-center gap-3">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                <circle cx="16" cy="16" r="14" stroke="#10B981" strokeWidth="2" />
                                <path d="M10 16L14 20L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p className="font-[Lexend] text-sm text-[#475569] text-center">
                                No hay sugerencias por el momento. ¡Buen trabajo!
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </aside>
    )
}
