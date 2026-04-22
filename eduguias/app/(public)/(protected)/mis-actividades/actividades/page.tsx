'use client'

import { useUiStore } from "@/stores/uiStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

function CuestionarioIcon({ color }: { color: string }) {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="36" height="44" rx="4" stroke={color} strokeWidth="2.5" fill="none" />
            <rect x="10" y="2" width="36" height="44" rx="4" stroke={color} strokeWidth="2" fill="none" opacity="0.35" />
            <circle cx="22" cy="26" r="9" stroke={color} strokeWidth="2.5" fill="none" />
            <text x="22" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill={color} fontFamily="Lexend, sans-serif">?</text>
        </svg>
    );
}

function UnionConceptosIcon({ color }: { color: string }) {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Top box */}
            <rect x="17" y="2" width="18" height="12" rx="2" stroke={color} strokeWidth="2.5" fill="none" />
            {/* Vertical connector */}
            <line x1="26" y1="14" x2="26" y2="22" stroke={color} strokeWidth="2" />
            {/* Horizontal bar */}
            <line x1="10" y1="22" x2="42" y2="22" stroke={color} strokeWidth="2" />
            {/* Left connector */}
            <line x1="10" y1="22" x2="10" y2="30" stroke={color} strokeWidth="2" />
            {/* Right connector */}
            <line x1="42" y1="22" x2="42" y2="30" stroke={color} strokeWidth="2" />
            {/* Center connector */}
            <line x1="26" y1="22" x2="26" y2="30" stroke={color} strokeWidth="2" />
            {/* Left box */}
            <rect x="1" y="30" width="18" height="12" rx="2" stroke={color} strokeWidth="2.5" fill="none" />
            {/* Center box */}
            <rect x="17" y="30" width="18" height="12" rx="2" stroke={color} strokeWidth="2.5" fill="none" />
            {/* Right box */}
            <rect x="33" y="30" width="18" height="12" rx="2" stroke={color} strokeWidth="2.5" fill="none" />
        </svg>
    );
}

function LecturaIcon({ color }: { color: string }) {
    return (
        <svg width="46" height="52" viewBox="0 0 46 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="38" height="48" rx="4" stroke={color} strokeWidth="2.5" fill="none" />
            <line x1="12" y1="16" x2="34" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="23" x2="34" y2="23" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="30" x2="34" y2="30" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="37" x2="24" y2="37" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function VideoGuiaIcon({ color }: { color: string }) {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="26" cy="26" r="22" stroke={color} strokeWidth="2.5" fill="none" />
            <path d="M21 18L37 26L21 34V18Z" fill={color} />
        </svg>
    );
}

function VerdaderoFalsoIcon({ color }: { color: string }) {
    return (
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="44" height="44" rx="6" stroke={color} strokeWidth="2.5" fill="none" />
            <path d="M26 14V26" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M18 22L26 14L34 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="16" y1="36" x2="36" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

// ── Data ─────────────────────────────────────────────────────────────────────

const templates = [
    {
        id: "cuestionario",
        label: "Cuestionario",
        description: "Perfect for assessment",
        bg: "bg-blue-50",
        iconColor: "#135BEC",
        icon: CuestionarioIcon,
        editorType: "cuestionario",
    },
    {
        id: "union",
        label: "Union de conceptos",
        description: "Engage with media",
        bg: "bg-purple-50",
        iconColor: "#9333EA",
        icon: UnionConceptosIcon,
        editorType: "union-conceptos",
    },
    {
        id: "lectura",
        label: "Lectura",
        description: "Engage with media",
        bg: "bg-yellow-50",
        iconColor: "#D97706",
        icon: LecturaIcon,
        editorType: "lectura",
    },
    {
        id: "video",
        label: "Video guia",
        description: "Engage with media",
        bg: "bg-rose-50",
        iconColor: "#E11D48",
        icon: VideoGuiaIcon,
        editorType: "video-guia",
    },
    {
        id: "verdadero",
        label: "Verdadero - Falso",
        description: "Engage with media",
        bg: "bg-teal-50",
        iconColor: "#0D9488",
        icon: VerdaderoFalsoIcon,
        editorType: "verdadero-falso",
    },
];

const recentItems = [
    {
        id: "math",
        title: "Math Finals - Grade 10",
        meta: "Cuestionario • Ultimo uso hace 2h",
        bg: "bg-blue-50",
        iconColor: "#135BEC",
        icon: CuestionarioIcon,
    },
    {
        id: "history",
        title: "Historical Revolution Study",
        meta: "Verdadero - Falso • Ultimo uso Ayer",
        bg: "bg-teal-50",
        iconColor: "#0D9488",
        icon: VerdaderoFalsoIcon,
    },
];

export default function EligePlantilla() {

    const router = useRouter();
    const setHeaderVisble = useUiStore((state) => state.setHeaderVisible);

    const handleNavigate = (route: string) => {
        router.push(route);
        setHeaderVisble(false);
    }

    return (
        <div className="min-h-screen bg-[#F6F6F8] font-[Lexend]">

            <main className="max-w-360 mx-auto px-6 lg:px-38.5 py-10">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
                    <div>
                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-2">
                            <Link
                                href="/mis-actividades"
                                className="font-[Lexend] text-sm text-[#475569] hover:text-[#135BEC] transition-colors"
                            >
                                Mis actividades
                            </Link>
                            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5 5L1 9" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="font-[Lexend] text-sm text-[#475569]">Crear nueva actividad</span>
                        </div>
                        <h1 className="font-[Lexend] text-[36px] font-black text-[#0F172A] leading-[1.2] tracking-[-1px] mb-2">
                            Elige una plantilla
                        </h1>
                        <p className="font-[Lexend] text-base text-[#475569] leading-6">
                            Selecciona un punto de inicio para tu proxima actividad
                        </p>
                    </div>

                    {/* Back button */}
                    <Link
                        href="/mis-actividades"
                        className="inline-flex items-center gap-2 self-start sm:self-auto mt-1 font-[Lexend] text-sm font-medium text-[#475569] bg-white border border-slate-200 rounded-xl px-5 py-3 hover:border-slate-300 hover:text-[#0F172A] transition-colors whitespace-nowrap"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Volver a Mis actividades
                    </Link>
                </div>

                {/* Template cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                    {templates.map((tpl) => {
                        const Icon = tpl.icon;
                        return (
                            <div
                                key={tpl.id}
                                className="flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                {/* Icon area */}
                                <div className={`flex items-center justify-center h-40 ${tpl.bg}`}>
                                    <Icon color={tpl.iconColor} />
                                </div>

                                {/* Body */}
                                <div className="flex flex-col flex-1 p-4 gap-3">
                                    <div>
                                        <p className="font-[Lexend] text-[15px] font-bold text-[#0F172A] leading-snug">
                                            {tpl.label}
                                        </p>
                                        <p className="font-[Lexend] text-xs text-[#64748B] leading-4 mt-0.5">
                                            {tpl.description}
                                        </p>
                                    </div>
                                    <button onClick={() => handleNavigate(`/mis-actividades/${tpl.editorType}`)} className="w-full font-[Lexend] text-sm font-semibold text-white bg-[#135BEC] rounded-xl py-2.5 hover:bg-blue-700 transition-colors shadow-[0_4px_6px_-1px_rgba(19,91,236,0.15)]">
                                        Seleccionar plantilla
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Recently used */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333ZM10.8333 10V5.83333H9.16667V11.6667H14.1667V10H10.8333Z" fill="#475569" />
                        </svg>
                        <h2 className="font-[Lexend] text-lg font-bold text-[#0F172A]">
                            Usados recientemente
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 px-5 py-4 hover:shadow-md transition-shadow duration-200 text-left group"
                                >
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 ${item.bg}`}>
                                        <div className="scale-50">
                                            <Icon color={item.iconColor} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-[Lexend] text-sm font-bold text-[#0F172A] truncate">
                                            {item.title}
                                        </p>
                                        <p className="font-[Lexend] text-xs text-[#64748B] mt-0.5">
                                            {item.meta}
                                        </p>
                                    </div>
                                    <svg
                                        width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        className="shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors"
                                    >
                                        <path d="M1 1L7 7L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
