interface EvaluacionStepProps {
	onNext: () => void;
	onPrev: () => void;
}

type UdlItem = {
	title: string;
	status: "ok" | "warning";
};

type WcagItem = {
	title: string;
	status: "ok" | "error";
	meta: string;
};

type ProblemItem = {
	tag: string;
	title: string;
	description: string;
	tone: "error" | "warning" | "info";
};

const udlItems: UdlItem[] = [
	{ title: "Multiples medios de representacion", status: "ok" },
	{ title: "Accion y Expresion", status: "warning" },
	{ title: "Compromiso", status: "ok" },
];

const wcagItems: WcagItem[] = [
	{ title: "Contraste", status: "error", meta: "2 problemas" },
	{ title: "Texto alternativo", status: "ok", meta: "Paso" },
	{ title: "Estructura", status: "ok", meta: "Paso" },
	{ title: "Idiomas", status: "ok", meta: "Paso" },
];

const problemItems: ProblemItem[] = [
	{
		tag: "WCAG 1.4.3",
		title: "Relacion de contraste insuficiente",
		description: "El texto en las opciones de 'Pregunta 4' tiene una proporcion de contraste de 3.2:1. El requisito minimo es 4.5:1.",
		tone: "error",
	},
	{
		tag: "UDL PRINCIPLE",
		title: "Limited Expressive Options",
		description: "El cuestionario depende en gran medida de la entrada basada en texto. Considere agregar una opcion para respuestas multiples o de imagenes.",
		tone: "warning",
	},
	{
		tag: "GUIDELINE",
		title: "Complex Language Structure",
		description: "La longitud de las oraciones en la seccion 'Objetivo' excede el nivel de legibilidad recomendado (Grado 14+).",
		tone: "info",
	},
];

function ringToneClass(value: number) {
	if (value >= 90) return "text-[#135BEC]";
	if (value >= 70) return "text-[#F59E0B]";
	return "text-[#EF4444]";
}

function ScoreRing({ value }: { value: number }) {
	const radius = 28;
	const stroke = 7;
	const circumference = 2 * Math.PI * radius;
	const dash = (value / 100) * circumference;

	return (
		<div className="relative h-20 w-20 shrink-0">
			<svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
				<circle cx="40" cy="40" r={radius} stroke="#E2E8F0" strokeWidth={stroke} />
				<circle
					cx="40"
					cy="40"
					r={radius}
					stroke="currentColor"
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={`${dash} ${circumference - dash}`}
					className={ringToneClass(value)}
				/>
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="font-lexend text-[24px] font-bold text-[#0F172A] leading-none">{value}</span>
			</div>
		</div>
	);
}

export function EvaluacionStep({ onNext, onPrev }: EvaluacionStepProps) {
	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="font-lexend text-[40px] font-extrabold tracking-[-1px] text-[#0F172A] leading-[1.05]">
					Evaluacion de calidad y accesibilidad
				</h1>
				<p className="mt-2 font-lexend text-base text-[#64748B] max-w-175">
					Su contenido ha sido revisado segun los estandares pedagogicos y de accesibilidad.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex items-center gap-4">
					<ScoreRing value={85} />
					<div>
						<h2 className="font-lexend text-[22px] font-bold text-[#0F172A] leading-tight">Calidad pedagogica</h2>
						<p className="font-lexend text-sm text-[#64748B] mt-1">Alineacion con los objetivos de aprendizaje</p>
					</div>
				</div>

				<div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 flex items-center gap-4">
					<ScoreRing value={92} />
					<div>
						<h2 className="font-lexend text-[22px] font-bold text-[#0F172A] leading-tight">Puntaje de accesibilidad</h2>
						<p className="font-lexend text-sm text-[#64748B] mt-1">Cumplimiento con WCAG 2.1</p>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div>
					<p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">Principios UDL</p>
					<div className="space-y-2.5">
						{udlItems.map((item) => (
							<div key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white p-4 flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									<span className={item.status === "ok" ? "text-emerald-500" : "text-amber-500"}>
										{item.status === "ok" ? "✓" : "!"}
									</span>
									<span className="font-lexend text-sm font-semibold text-[#0F172A]">{item.title}</span>
								</div>
								<span className="text-[#CBD5E1]">○</span>
							</div>
						))}
					</div>
				</div>

				<div>
					<p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">Cumplimiento de WCAG</p>
					<div className="grid grid-cols-2 gap-2.5">
						{wcagItems.map((item) => (
							<div key={item.title} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
								<p className="font-lexend text-sm font-semibold text-[#0F172A]">{item.title}</p>
								<p className={`font-lexend text-[11px] uppercase font-bold mt-1 ${item.status === "error" ? "text-[#EF4444]" : "text-emerald-500"}`}>
									{item.meta}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>

			<div>
				<p className="font-lexend text-xs uppercase tracking-[1.2px] text-[#94A3B8] font-bold mb-3">Problemas identificados (3)</p>
				<div className="space-y-3">
					{problemItems.map((item) => {
						const toneClass =
							item.tone === "error"
								? "border-l-[#EF4444]"
								: item.tone === "warning"
									? "border-l-[#F59E0B]"
									: "border-l-[#3B82F6]";

						const tagClass =
							item.tone === "error"
								? "bg-red-50 text-[#EF4444]"
								: item.tone === "warning"
									? "bg-amber-50 text-[#F59E0B]"
									: "bg-blue-50 text-[#3B82F6]";

						return (
							<div key={item.title} className={`rounded-xl border border-[#E2E8F0] border-l-4 ${toneClass} bg-white p-4`}>
								<div className="flex items-center gap-2">
									<span className={`px-2 py-1 rounded text-[10px] font-bold tracking-[0.3px] ${tagClass}`}>{item.tag}</span>
									<h3 className="font-lexend text-[20px] font-bold text-[#0F172A] leading-tight">{item.title}</h3>
								</div>
								<p className="mt-2 font-lexend text-sm text-[#475569]">{item.description}</p>
								<button className="mt-3 h-9 px-4 rounded-lg bg-[#135BEC] text-white font-lexend text-sm font-bold hover:bg-[#0f4fd1] transition-colors">
									Ir a arreglar
								</button>
							</div>
						);
					})}
				</div>
			</div>

			<div className="flex items-center justify-between pt-2">
				<button
					onClick={onPrev}
					className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#475569] font-lexend font-bold text-base hover:bg-[#F8FAFC] transition-colors"
				>
					Volver atras
				</button>
				<button
					onClick={onNext}
					className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#135BEC] text-white font-lexend font-bold text-base hover:bg-[#0f4fd1] transition-colors"
				>
					Continuar a descarga
				</button>
			</div>
		</div>
	);
}
