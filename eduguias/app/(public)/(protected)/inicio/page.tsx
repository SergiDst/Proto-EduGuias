import Link from "next/link";
import { QuizIcon, ConceptMapIcon, ReadingIcon, VideoIcon, DotsIcon } from "@/components/InicioIcons";
import { ActivityRowIcon } from "@/components/ActivityRowIcon";

/* ── Data ── */
const quickStartCards = [
	{
		id: "quiz",
		icon: <QuizIcon />,
		iconBg: "bg-blue-50",
		title: "Cuestionario",
		description: "Crea preguntas con varias opciones de respuesta",
	},
	{
		id: "concept",
		icon: <ConceptMapIcon />,
		iconBg: "bg-amber-50",
		title: "Union de conceptos",
		description: "Visualiza ideas complejas para mayor entendimiento",
	},
	{
		id: "reading",
		icon: <ReadingIcon />,
		iconBg: "bg-emerald-50",
		title: "Lectura",
		description: "Escribe escenarios para casos concretos",
	},
	{
		id: "video",
		icon: <VideoIcon />,
		iconBg: "bg-violet-50",
		title: "Video guia",
		description: "Añade preguntas o puntos claves en el video",
	},
];

const recentActivities = [
	{
		id: 1,
		name: "Intro a Biologia Molecular",
		subject: "Biologia Modulo 101",
		type: "Cuestionario",
		score: 92,
		lastEdited: "Oct 24, 2023",
	},
	{
		id: 2,
		name: "Movimiento del arte renacentista",
		subject: "Arte e Historia III",
		type: "Union de conceptos",
		score: 78,
		lastEdited: "Oct 22, 2023",
	},
	{
		id: 3,
		name: "Impacto global de la energia sostenible",
		subject: "Ciencias",
		type: "Video guia",
		score: 45,
		lastEdited: "Oct 19, 2023",
	},
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

/* ── Page ── */
export default function InicioPage() {
	return (
		<div className="min-h-screen bg-edu-bg font-lexend">

			<main className="max-w-300 mx-auto px-6 lg:px-10 py-10 flex flex-col gap-12">

				{/* Welcome */}
				<section className="flex flex-col gap-1">
					<h1 className="font-lexend font-extrabold text-4xl lg:text-[42px] leading-tight text-edu-dark">
						Te damos la bienvenida, Nombre usuario
					</h1>
					<p className="font-lexend font-normal text-base text-edu-muted">
						Tienes x actividades pendientes para revisión.
					</p>
				</section>

				{/* Quick start */}
				<section className="flex flex-col gap-5">
					<div className="flex items-center justify-between">
						<h2 className="font-lexend font-extrabold text-2xl text-edu-dark">
							Inicio rapido
						</h2>
						<Link
							href="/plantillas"
							className="font-lexend font-semibold text-sm text-brand hover:underline flex items-center gap-1"
						>
							Ver plantillas de actividades →
						</Link>
					</div>

					<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
						{quickStartCards.map((card) => (
							<button
								key={card.id}
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
					<div className="flex items-center justify-between">
						<h2 className="font-lexend font-extrabold text-2xl text-edu-dark">
							Actividades recientes
						</h2>
						<Link
							href="/mis-actividades/actividades"
							className="flex items-center gap-1.5 bg-brand text-white font-lexend font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-600 transition-colors"
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
								<path d="M12 4.5v15m7.5-7.5h-15" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
							Nueva actividad
						</Link>
					</div>

					{/* Table */}
					<div className="bg-white rounded-2xl border border-edu-light overflow-hidden">
						{/* Header */}
						<div className="grid grid-cols-[0.35fr_0.16fr_0.25fr_0.1fr_0.08fr] items-center justify-around px-6 py-3 gap-5 border-b border-edu-light">
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
								className={`grid grid-cols-[0.36fr_0.17fr_0.27fr_0.12fr_0.08fr] items-center px-6 py-4 gap-5 ${i < recentActivities.length - 1 ? "border-b border-edu-light" : ""}`}
							>
								{/* Name */}
								<div className="flex items-center gap-3">
									<ActivityRowIcon type={activity.type} />
									<div className="flex flex-col">
										<span className="font-lexend font-bold text-sm text-edu-dark">
											{activity.name}
										</span>
										<span className="font-lexend font-normal text-xs text-edu-muted">
											{activity.subject}
										</span>
									</div>
								</div>

								{/* Type */}
								<div className="flex ">
									<span className="font-lexend font-normal text-sm text-edu-muted">
										{activity.type}
									</span>
								</div>

								{/* Score */}
								<div className="w-[full] flex flex-row items-center justify-center gap-3">
									<div className="flex-2 h-2 bg-edu-light rounded-full overflow-hidden">
										<div
											className={`h-full rounded-full ${scoreColor(activity.score)}`}
											style={{ width: `${activity.score}%` }}
										/>
									</div>
									<span className={`font-lexend font-bold text-sm shrink-0 ${scoreTextColor(activity.score)}`}>
										{activity.score}%
									</span>
								</div>

								{/* Date */}
								<div className="w-[full] flex items-center justify-center">

									<span className="font-lexend font-normal text-sm text-edu-muted">
										{activity.lastEdited}
									</span>
								</div>

								{/* Options */}
								<div className="flex items-center justify-end gap-3">

									<button className="p-1 rounded hover:bg-edu-light transition-colors">
										<DotsIcon />
									</button>
								</div>
							</div>
						))}
					</div>

				</section>
			</main>
		</div>
	);
}