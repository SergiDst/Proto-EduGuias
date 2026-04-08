import Link from "next/link";

/* ── Activity type icons ── */
const QuizIcon = () => (
	<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0 3-3m-3 3 3 3" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const ConceptMapIcon = () => (
	<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M3 9h4v2H3V9Zm14 0h4v2h-4V9Zm-7-6h4v2h-4V3Zm0 16h4v2h-4v-2Zm3.5-10.5-3 3m0 0-3 3m3-3 3 3m-3-3-3-3" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
		<rect x="1" y="8" width="6" height="4" rx="1" stroke="#F59E0B" strokeWidth="1.5" />
		<rect x="17" y="8" width="6" height="4" rx="1" stroke="#F59E0B" strokeWidth="1.5" />
		<rect x="9" y="2" width="6" height="4" rx="1" stroke="#F59E0B" strokeWidth="1.5" />
		<rect x="9" y="18" width="6" height="4" rx="1" stroke="#F59E0B" strokeWidth="1.5" />
	</svg>
);

const ReadingIcon = () => (
	<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const VideoIcon = () => (
	<svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#8B5CF6" strokeWidth="1.5" />
		<path d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const DotsIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none">
		<path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

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

const ActivityRowIcon = ({ type }: { type: string }) => {
	const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
		Cuestionario: {
			bg: "bg-blue-100",
			icon: (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" stroke="#135BEC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			),
		},
		"Union de conceptos": {
			bg: "bg-amber-100",
			icon: (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			),
		},
		"Video guia": {
			bg: "bg-violet-100",
			icon: (
				<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
					<path d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
			),
		},
	};
	const s = styles[type] ?? styles["Cuestionario"];
	return (
		<div className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center shrink-0`}>
			{s.icon}
		</div>
	);
};

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
							href="/mis-actividades"
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