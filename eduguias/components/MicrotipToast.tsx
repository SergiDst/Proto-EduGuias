"use client";

import { useEffect, useState } from "react";
import type { Microtip, MicrotipType } from "@/interfaces/uiStore";
import { useUiStore } from "@/stores/uiStore";

const typeConfig: Record<MicrotipType, { icon: React.ReactNode; bg: string; border: string; titleColor: string; bodyColor: string; badgeBg: string; badgeText: string }> = {
    WCAG: {
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L16.5 15H1.5L9 1.5Z" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 7.5V10.5" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="12.75" r="0.75" fill="#D97706" />
            </svg>
        ),
        bg: "bg-amber-50",
        border: "border-amber-200",
        titleColor: "text-amber-800",
        bodyColor: "text-amber-700",
        badgeBg: "bg-amber-100",
        badgeText: "text-amber-700",
    },
    UDL: {
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="#135BEC" strokeWidth="1.5" />
                <path d="M9 8.25V13.5" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="9" cy="5.625" r="0.875" fill="#135BEC" />
            </svg>
        ),
        bg: "bg-blue-50",
        border: "border-blue-200",
        titleColor: "text-blue-900",
        bodyColor: "text-blue-700",
        badgeBg: "bg-blue-100",
        badgeText: "text-blue-700",
    },
    Clarity: {
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2.25C5.27 2.25 2.25 5.27 2.25 9C2.25 12.73 5.27 15.75 9 15.75C12.73 15.75 15.75 12.73 15.75 9" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M12 2.25L15.75 2.25L15.75 6" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10.5 7.5L15.75 2.25" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        bg: "bg-slate-50",
        border: "border-slate-200",
        titleColor: "text-slate-800",
        bodyColor: "text-slate-600",
        badgeBg: "bg-slate-100",
        badgeText: "text-slate-600",
    },
};

function MicrotipToastCard({ tip, onDismiss }: { tip: Microtip; onDismiss: () => void }) {
    const cfg = typeConfig[tip.type];
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <div
            className={`pointer-events-auto w-[calc(100vw-2rem)] sm:w-80 rounded-2xl border shadow-xl transition-all duration-400 ${cfg.bg} ${cfg.border} ${
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease" }}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                        <span className="shrink-0 mt-0.5">{cfg.icon}</span>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${cfg.badgeBg} ${cfg.badgeText}`}>
                                    {tip.type}
                                </span>
                            </div>
                            <p className={`font-[Lexend] text-[13px] font-bold leading-snug ${cfg.titleColor}`}>
                                {tip.title}
                            </p>
                            <p className={`font-[Lexend] text-[12px] leading-[1.6] mt-1 ${cfg.bodyColor}`}>
                                {tip.body}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onDismiss}
                        className="shrink-0 mt-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                        aria-label="Mover al panel"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <p className="font-[Lexend] text-[10px] text-slate-400">
                        Se moverá al panel en unos segundos →
                    </p>
                    <button
                        onClick={onDismiss}
                        className="font-[Lexend] text-[11px] font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Entendido
                    </button>
                </div>
            </div>
            {/* Progress bar */}
            <div className="h-1 rounded-b-2xl overflow-hidden bg-white/40">
                <div
                    className="h-full bg-current opacity-30 animate-shrink"
                    style={{ animation: "progressShrink 5s linear forwards" }}
                />
            </div>
        </div>
    );
}

export function MicrotipToastContainer() {
    const activeTip = useUiStore((state) => state.activeMicrotipToast);
    const dismissMicrotipToast = useUiStore((state) => state.dismissMicrotipToast);

    // Esc dismisses the active toast
    useEffect(() => {
        if (!activeTip) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") dismissMicrotipToast();
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [activeTip, dismissMicrotipToast]);

    return (
        <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-16 z-50 flex flex-col gap-3 pointer-events-none max-w-[calc(100vw-2rem)]"
        >
            {activeTip ? <MicrotipToastCard tip={activeTip} onDismiss={dismissMicrotipToast} /> : null}
        </div>
    );
}
