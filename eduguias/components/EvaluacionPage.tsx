"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useAuthStore } from "@/stores/authStore";
import { computeAccessibilityScore } from "@/utils/microtipsAnalysis";
import type { CuestionarioPayload, ActivityType } from "@/interfaces/actividades";

interface EvaluacionStepProps {
    onNext: () => void;
    onPrev: () => void;
    tipoActividad?: ActivityType;
}

const isCuestionarioPayload = (value: unknown): value is CuestionarioPayload => {
    if (!value || typeof value !== "object") return false;
    const c = value as CuestionarioPayload;
    return Array.isArray(c.questions) && typeof c.instructions === "string";
};

function ringColor(value: number) {
    if (value >= 80) return "#10B981";
    if (value >= 60) return "#F59E0B";
    return "#EF4444";
}

function ScoreRing({ value, label }: { value: number; label: string }) {
    const radius = 28;
    const stroke = 7;
    const circumference = 2 * Math.PI * radius;
    const dash = (value / 100) * circumference;
    const color = ringColor(value);

    return (
        <div className="relative h-20 w-20 shrink-0" aria-label={`${label}: ${value} de 100`}>
            <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r={radius} stroke="#E2E8F0" strokeWidth={stroke} />
                <circle
                    cx="40" cy="40" r={radius}
                    stroke={color} strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-lexend text-[22px] font-bold text-[#0F172A] leading-none">{value}</span>
            </div>
        </div>
    );
}

export function EvaluacionStep({ onNext, onPrev, tipoActividad = "cuestionario" }: EvaluacionStepProps) {
    const selectedActividad = useActividadesStore((state) => state.selectedActividad);
    const questionnaireDraft = useActividadesStore((state) => state.questionnaireDraft);
    const draftSubject = useActividadesStore((state) => state.draftSubject);
    const createActividad = useActividadesStore((state) => state.createActividad);
    const updateActividad = useActividadesStore((state) => state.updateActividad);
    const loading = useActividadesStore((state) => state.loading);
    const user = useAuthStore((state) => state.user);
    const router = useRouter();

    const payload = questionnaireDraft ?? (
        selectedActividad?.type === "cuestionario" && isCuestionarioPayload(selectedActividad.payload)
            ? selectedActividad.payload
            : null
    );

    const score = useMemo(() => {
        if (!payload) return null;
        return computeAccessibilityScore(payload);
    }, [payload]);

    const handleSaveAndContinue = async () => {
        if (!user?.uid || !payload) return;

        const finalScore = score ? Math.round((score.pedagogicalScore + score.wcagScore) / 2) : 0;

        try {
            if (selectedActividad?.id) {
                await updateActividad(user.uid, selectedActividad.id, {
                    score: finalScore,
                    subject: draftSubject || selectedActividad.subject,
                    payload,
                });
            } else {
                await createActividad(user.uid, {
                    type: tipoActividad,
                    subject: draftSubject || selectedActividad?.subject || "General",
                    title: (payload as CuestionarioPayload).activityTitle?.trim() || "Sin título",
                    score: finalScore,
                    payload,
                });
            }
            onNext();
        } catch (_e) {
            // error is handled by the store
        }
    };

    if (!payload || !score) {
        return (
            <div className="flex flex-col gap-6 sm:gap-8">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                    <p className="font-lexend text-base font-semibold text-amber-700">
                        Completa las secciones anteriores para ver la evaluación de tu actividad.
                    </p>
                </div>
                <div className="flex items-center justify-between">
                    <button onClick={onPrev} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#475569] font-lexend font-bold hover:bg-[#F8FAFC] transition-colors">
                        Volver atrás
                    </button>
                </div>
            </div>
        );
    }

    const toneClass = (tone: string) => ({
        error: "border-l-[#EF4444]",
        warning: "border-l-[#F59E0B]",
        info: "border-l-[#3B82F6]",
    }[tone] ?? "border-l-slate-300");

    const tagClass = (tone: string) => ({
        error: "bg-red-50 text-[#EF4444]",
        warning: "bg-amber-50 text-[#F59E0B]",
        info: "bg-blue-50 text-[#3B82F6]",
    }[tone] ?? "bg-slate-50 text-slate-500");

    const sectionLabels: Record<string, string> = {
        objetivo: "Ir a Objetivo",
        contenido: "Ir a Contenido",
        retroalimentacion: "Ir a Retroalimentación",
        paleta: "Ir a Paleta",
    };

    return (
        <div className="flex flex-col gap-6 sm:gap-8">
            <div>
                <h1 className="font-lexend text-[38px] font-extrabold tracking-[-1px] text-[#0F172A] leading-[1.05]">
                    Evaluación de calidad y accesibilidad
                </h1>
                <p className="mt-2 font-lexend text-base text-[#64748B] max-w-2xl">
                    Tu contenido ha sido revisado según los estándares pedagógicos UDL y de accesibilidad WCAG 2.1.
                </p>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex items-center gap-4 shadow-sm">
                    <ScoreRing value={score.pedagogicalScore} label="Calidad pedagógica" />
                    <div>
                        <h2 className="font-lexend text-xl font-bold text-[#0F172A] leading-tight">Calidad pedagógica</h2>
                        <p className="font-lexend text-sm text-[#64748B] mt-1">
                            {score.pedagogicalScore >= 80
                                ? "Excelente alineación con los principios UDL"
                                : score.pedagogicalScore >= 60
                                    ? "Buena base, hay margen de mejora"
                                    : "Revisa las sugerencias del asistente"}
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex items-center gap-4 shadow-sm">
                    <ScoreRing value={score.wcagScore} label="Puntaje de accesibilidad" />
                    <div>
                        <h2 className="font-lexend text-xl font-bold text-[#0F172A] leading-tight">Puntaje de accesibilidad</h2>
                        <p className="font-lexend text-sm text-[#64748B] mt-1">
                            {score.wcagScore >= 80
                                ? "Cumple con WCAG 2.1 nivel AA"
                                : score.wcagScore >= 60
                                    ? "Parcialmente accesible, revisa el contraste"
                                    : "Requiere correcciones de accesibilidad"}
                        </p>
                    </div>
                </div>
            </div>

            {/* UDL + WCAG grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">Principios UDL</p>
                    <div className="space-y-2.5">
                        {score.udlItems.map((item) => (
                            <div key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-2.5">
                                    <span className={`text-sm font-bold ${item.status === "ok" ? "text-emerald-500" : "text-amber-500"}`}>
                                        {item.status === "ok" ? "✓" : "!"}
                                    </span>
                                    <span className="font-lexend text-sm font-semibold text-[#0F172A]">{item.title}</span>
                                </div>
                                <span className={`font-lexend text-[11px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                    item.status === "ok" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                }`}>
                                    {item.status === "ok" ? "OK" : "Revisar"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">Cumplimiento de WCAG</p>
                    <div className="grid grid-cols-2 gap-2.5">
                        {score.wcagItems.map((item) => (
                            <div key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                                <p className="font-lexend text-sm font-semibold text-[#0F172A]">{item.title}</p>
                                <p className={`font-lexend text-[11px] uppercase font-bold mt-1 ${
                                    item.status === "error" ? "text-[#EF4444]" : "text-emerald-500"
                                }`}>
                                    {item.meta}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Problems */}
            {score.problems.length > 0 && (
                <div>
                    <p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">
                        Problemas identificados ({score.problems.length})
                    </p>
                    <div className="space-y-3">
                        {score.problems.map((item, index) => (
                            <div
                                key={index}
                                className={`rounded-xl border border-[#E2E8F0] border-l-4 ${toneClass(item.tone)} bg-white p-4`}
                            >
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-[0.3px] ${tagClass(item.tone)}`}>
                                        {item.tag}
                                    </span>
                                    <h3 className="font-lexend text-base font-bold text-[#0F172A]">{item.title}</h3>
                                </div>
                                <p className="mt-2 font-lexend text-sm text-[#475569] leading-relaxed">{item.description}</p>
                                {item.section && sectionLabels[item.section] && (
                                    <button
                                        onClick={() => router.push(`/mis-actividades/${tipoActividad}/${item.section}`)}
                                        className="mt-3 h-9 px-4 rounded-lg bg-[#135BEC] text-white font-lexend text-sm font-bold hover:bg-[#0f4fd1] transition-colors"
                                    >
                                        {sectionLabels[item.section]}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {score.problems.length === 0 && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 flex items-center gap-4">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="14" stroke="#10B981" strokeWidth="2" />
                        <path d="M10 16L14 20L22 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div>
                        <p className="font-lexend text-base font-bold text-emerald-800">¡Excelente trabajo!</p>
                        <p className="font-lexend text-sm text-emerald-700 mt-0.5">
                            No se detectaron problemas de accesibilidad o pedagogía. Tu actividad está lista.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={onPrev}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#475569] font-lexend font-bold text-base hover:bg-[#F8FAFC] transition-colors"
                >
                    Volver atrás
                </button>
                <button
                    onClick={handleSaveAndContinue}
                    disabled={loading}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-lexend font-bold text-base transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)] ${
                        loading
                            ? "bg-[#94A3B8] text-white cursor-not-allowed"
                            : "bg-[#135BEC] text-white hover:bg-[#0f4fd1]"
                    }`}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="20 10" />
                            </svg>
                            Guardando…
                        </>
                    ) : (
                        <>
                            Guardar y continuar a descarga
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
