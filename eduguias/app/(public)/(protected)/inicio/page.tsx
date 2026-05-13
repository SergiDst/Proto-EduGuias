'use client';

import Link from "next/link";
import { QuizIcon, ConceptMapIcon, ReadingIcon, VideoIcon } from "@/components/InicioIcons";
import { ActivityRowIcon } from "@/components/ActivityRowIcon";
import { ActivityRowMenu } from "@/components/ActivityRowMenu";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useActividadesStore } from "@/stores/actividadesStore";
import { useUserProfileStore } from "@/stores/userProfileStore";
import { useUiStore } from "@/stores/uiStore";
import { toDisplayActivityType, toEditorActivityType } from "@/constants/activityTypes";
import { generateHtmlActivity } from "@/utils/generateHtml";
import type { CuestionarioPayload } from "@/interfaces/actividades";

/* ── Data ── */
// NOTE: Solo se mantiene el tipo "cuestionario" por ahora.
// Las demás tarjetas están comentadas hasta su implementación.
const quickStartCards = [
	{
		id: "quiz",
		icon: <QuizIcon />,
		iconBg: "bg-blue-50",
		title: "Cuestionario",
		description: "Crea preguntas con varias opciones de respuesta",
		editorType: "cuestionario",
	},
	// {
	// 	id: "concept",
	// 	icon: <ConceptMapIcon />,
	// 	iconBg: "bg-amber-50",
	// 	title: "Union de conceptos",
	// 	description: "Visualiza ideas complejas para mayor entendimiento",
	// 	editorType: "union-conceptos",
	// },
	// {
	// 	id: "reading",
	// 	icon: <ReadingIcon />,
	// 	iconBg: "bg-emerald-50",
	// 	title: "Lectura",
	// 	description: "Escribe escenarios para casos concretos",
	// 	editorType: "lectura",
	// },
	// {
	// 	id: "video",
	// 	icon: <VideoIcon />,
	// 	iconBg: "bg-violet-50",
	// 	title: "Video guia",
	// 	description: "Añade preguntas o puntos claves en el video",
	// 	editorType: "video-guia",
	// },
];

/* ── Utils ── */
const scoreColor = (score: number) => {
	if (score >= 80) return "bg-emerald-500";
	if (score >= 60) return "bg-blue-500";
	return "bg-red-500";
};

const scoreTextColor = (score: number) => {
	if (score >= 80) return "text-emerald-600";
	if (score >= 60) return "text-blue-600";
	return "text-red-500";
};

const formatDate = (date: Date | null) => {
	if (!date) {
		return "Sin fecha";
	}

	return new Intl.DateTimeFormat("es-ES", {
		month: "short",
		day: "2-digit",
		year: "numeric",
	}).format(date);
};

/* ── Page ── */
export default function InicioPage() {
	const router = useRouter();
	const user = useAuthStore((state) => state.user);
	const authReady = useAuthStore((state) => state.authReady);
	const actividades = useActividadesStore((state) => state.actividades);
	const loading = useActividadesStore((state) => state.loading);
	const error = useActividadesStore((state) => state.error);
	const fetchActividadesByUser = useActividadesStore((state) => state.fetchActividadesByUser);
	const fetchActividadById = useActividadesStore((state) => state.fetchActividadById);
	const deleteActividad = useActividadesStore((state) => state.deleteActividad);
	const profile = useUserProfileStore((state) => state.profile);
	const fetchProfile = useUserProfileStore((state) => state.fetchProfile);
	const setGlobalModal = useUiStore((state) => state.setGlobalModal);

	const [exportingId, setExportingId] = useState<string | null>(null);

	useEffect(() => {
		if (!authReady || !user?.uid) {
			return;
		}

		fetchActividadesByUser(user.uid).catch(() => undefined);
		fetchProfile(user.uid).catch(() => undefined);
	}, [authReady, user?.uid, fetchActividadesByUser, fetchProfile]);

	// Display name: profile.Apodo > displayName > email-prefix > generic fallback
	const displayName = useMemo(() => {
		if (profile?.Apodo && profile.Apodo.trim().length > 0) {
			return profile.Apodo;
		}
		if (user?.displayName && user.displayName.trim().length > 0) {
			return user.displayName;
		}
		if (user?.email) {
			return user.email.split("@")[0];
		}
		return "docente";
	}, [profile?.Apodo, user?.displayName, user?.email]);

	const recentActivities = useMemo(
		() =>
			actividades.slice(0, 3).map((activity) => ({
				id: activity.id,
				editorType: toEditorActivityType(activity.type),
				name: activity.title,
				subject: activity.subject,
				type: toDisplayActivityType(activity.type),
				score: activity.score,
				lastEdited: formatDate(activity.updatedAt ?? activity.createdAt),
			})),
		[actividades]
	);

	const handleEditActivity = async (actividadId: string, editorType: string) => {
		if (!user?.uid) {
			return;
		}

		const actividad = await fetchActividadById(user.uid, actividadId);
		if (!actividad) {
			return;
		}

		router.push(`/mis-actividades/${editorType}?actividadId=${actividad.id}`);
	};

	const handleExportActivity = async (actividadId: string) => {
		if (!user?.uid) return;
		setExportingId(actividadId);
		try {
			const actividad = await fetchActividadById(user.uid, actividadId);
			if (!actividad || actividad.type !== "cuestionario" || !actividad.payload) {
				setGlobalModal({
					visible: true,
					titulo: "No se puede exportar",
					descripcion: "Esta actividad aún no tiene contenido completo.",
					onClose: () => setGlobalModal({ visible: false }),
				});
				return;
			}
			const html = generateHtmlActivity(
				actividad.payload as CuestionarioPayload,
				actividad.title,
				actividad.subject
			);
			const blob = new Blob([html], { type: "text/html;charset=utf-8" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${actividad.title.replace(/\s+/g, "_").toLowerCase()}.html`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} finally {
			setExportingId(null);
		}
	};

	const handleDeleteActivity = (actividadId: string, name: string) => {
		if (!user?.uid) return;
		setGlobalModal({
			visible: true,
			titulo: "Eliminar actividad",
			descripcion: `¿Seguro que deseas eliminar la actividad "${name}"? Esta acción no se puede deshacer.`,
			showConfirm: true,
			onClose: () => setGlobalModal({ visible: false }),
			onConfirm: async () => {
				try {
					await deleteActividad(user.uid, actividadId);
				} finally {
					setGlobalModal({ visible: false });
				}
			},
		});
	};

	return (
		<div className="min-h-screen bg-edu-bg font-lexend">

			<main id="main-content" className="max-w-300 mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 flex flex-col gap-8 sm:gap-12">

				{/* Welcome */}
				<section className="flex flex-col gap-1">
					<h1 className="font-lexend font-extrabold text-2xl sm:text-4xl lg:text-[42px] leading-tight text-edu-dark">
						Te damos la bienvenida, {displayName}
					</h1>
					<p className="font-lexend font-normal text-sm sm:text-base text-edu-muted">
						Tienes {actividades.length} actividades en total.
					</p>
				</section>

				{/* Quick start */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center justify-between gap-3 flex-wrap">
						<h2 className="font-lexend font-extrabold text-xl sm:text-2xl text-edu-dark">
							Inicio rapido
						</h2>
						<Link
							href="/plantillas"
							className="font-lexend font-semibold text-sm text-brand hover:underline flex items-center gap-1"
						>
							Ver plantillas →
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{quickStartCards.map((card) => (
							<button
								key={card.id}
								onClick={() => router.push(`/mis-actividades/${card.editorType}`)}
								className="cursor-pointer bg-white rounded-2xl border border-edu-light overflow-hidden text-left hover:shadow-md transition-shadow flex flex-col"
							>
								{/* Icon area */}
								<div className={`${card.iconBg} w-full flex items-center justify-center py-10`}>
									{card.icon}
								</div>
								{/* Text */}
								<div className="p-4 flex flex-col gap-1">
									<span className="font-lexend font-bold text-base text-edu-dark">
										{card.title}
									</span>
									<span className="font-lexend font-normal text-sm text-edu-muted leading-snug">
										{card.description}
									</span>
								</div>
							</button>
						))}
					</div>
				</section>

				{/* Recent activities */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center justify-between gap-3 flex-wrap">
						<h2 className="font-lexend font-extrabold text-xl sm:text-2xl text-edu-dark">
							Actividades recientes
						</h2>
						<Link
							href="/mis-actividades/actividades"
							className="flex items-center gap-1.5 bg-brand text-white font-lexend font-bold text-sm px-4 sm:px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path d="M12 4.5v15m7.5-7.5h-15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							<span className="hidden sm:inline">Nueva actividad</span>
							<span className="sm:hidden">Nueva</span>
						</Link>
					</div>

					{/* Table */}
					<div className="bg-white rounded-2xl border border-edu-light overflow-hidden">
						{/* Header (hidden on mobile) */}
						<div className="hidden md:grid grid-cols-[0.35fr_0.16fr_0.25fr_0.1fr_0.08fr] items-center justify-around px-6 py-3 gap-5 border-b border-edu-light">
							<span className="font-lexend flex font-semibold text-xs tracking-widest text-edu-muted uppercase">
								Nombre de la actividad
							</span>
							<span className="font-lexend text-start font-semibold text-xs tracking-widest text-edu-muted uppercase">
								Tipo
							</span>
							<span className="font-lexend text-center font-semibold text-xs tracking-widest text-edu-muted uppercase">
								Puntaje de accesibilidad
							</span>
							<span className="font-lexend text-center font-semibold text-xs tracking-widest text-edu-muted uppercase">
								Ultima edición
							</span>
							<span className="font-lexend font-semibold text-xs tracking-widest text-edu-muted uppercase">
								Opciones
							</span>
						</div>

						{/* Rows */}
						{recentActivities.map((activity, i) => (
							<div key={activity.id}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										handleEditActivity(activity.id, activity.editorType);
									}
								}}
								className={`grid grid-cols-[1fr_auto] md:grid-cols-[0.36fr_0.17fr_0.27fr_0.12fr_0.08fr] items-center px-4 sm:px-6 py-4 gap-3 md:gap-5 cursor-pointer hover:bg-slate-50 ${i < recentActivities.length - 1 ? "border-b border-edu-light" : ""}`}
								onClick={() => handleEditActivity(activity.id, activity.editorType)}
								aria-label={`${activity.name}, ${activity.type}, puntaje ${activity.score}%`}
							>
								{/* Name + meta (mobile: shows everything stacked) */}
								<div className="flex items-center gap-3 min-w-0">
									<ActivityRowIcon type={activity.type} />
									<div className="flex flex-col min-w-0 flex-1">
										<span className="font-lexend font-bold text-sm text-edu-dark truncate">
											{activity.name}
										</span>
										<span className="font-lexend font-normal text-xs text-edu-muted truncate">
											{activity.subject} · <span className="md:hidden">{activity.type}</span>
											<span className="hidden md:inline">{activity.lastEdited}</span>
										</span>
										{/* Mobile-only: score bar inline */}
										<div className="md:hidden mt-2 flex flex-row items-center gap-2">
											<div className="flex-1 h-1.5 bg-edu-light rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full ${scoreColor(activity.score)}`}
													style={{ width: `${activity.score}%` }}
												/>
											</div>
											<span className={`font-lexend font-bold text-xs shrink-0 ${scoreTextColor(activity.score)}`}>
												{activity.score}%
											</span>
										</div>
									</div>
								</div>

								{/* Type (hidden on mobile, shown beside name above) */}
								<div className="hidden md:flex">
									<span className="font-lexend font-normal text-sm text-edu-muted">
										{activity.type}
									</span>
								</div>

								{/* Score (desktop) */}
								<div className="hidden md:flex w-full flex-row items-center justify-center gap-3">
									<div className="flex-1 h-2 bg-edu-light rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full ${scoreColor(activity.score)}`}
											style={{ width: `${activity.score}%` }}
										/>
									</div>
									<span className={`font-lexend font-bold text-sm shrink-0 ${scoreTextColor(activity.score)}`}>
										{activity.score}%
									</span>
								</div>

								{/* Date (desktop only) */}
								<div className="hidden md:flex w-full items-center justify-center">
									<span className="font-lexend font-normal text-sm text-edu-muted">
										{activity.lastEdited}
									</span>
								</div>

								{/* Options */}
								<div className="flex items-center justify-end gap-3">
									<ActivityRowMenu
										onEdit={() => handleEditActivity(activity.id, activity.editorType)}
										onExport={() => handleExportActivity(activity.id)}
										onDelete={() => handleDeleteActivity(activity.id, activity.name)}
									/>
									{exportingId === activity.id ? (
										<span className="font-lexend text-[11px] text-[#94A3B8]">…</span>
									) : null}
								</div>
							</div>
						))}

						{loading ? (
							<div className="px-6 py-4 text-sm text-edu-muted border-t border-edu-light">
								Cargando actividades...
							</div>
						) : null}

						{error ? (
							<div className="px-6 py-4 text-sm text-red-600 border-t border-edu-light bg-red-50">
								{error}
							</div>
						) : null}

						{!loading && !error && recentActivities.length === 0 ? (
							<div className="px-6 py-4 text-sm text-edu-muted border-t border-edu-light">
								Aun no hay actividades recientes.
							</div>
						) : null}
					</div>

				</section>
			</main>
		</div>
	);
}