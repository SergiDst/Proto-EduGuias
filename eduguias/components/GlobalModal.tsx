"use client";

import { useUiStore } from "@/stores/uiStore";

export default function GlobalModal() {
	const globalModal = useUiStore((state) => state.globalModal);

	if (!globalModal.visible) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
			<div className="w-full max-w-md rounded-[35px] bg-white px-2.5 py-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
				<div className="flex flex-col items-center gap-4">
					{globalModal.imageIcon ? (
						<div className="flex items-center justify-center">
							{globalModal.imageIcon}
						</div>
					) : null}

					<h2 className="font-lexend text-[30px] font-extrabold text-foreground">
						{globalModal.titulo}
					</h2>

					<p className="max-w-sm font-lexend text-[20px] font-normal leading-relaxed text-edu-muted">
						{globalModal.descripcion}
					</p>

					<button
						type="button"
						className="mt-2 min-w-44 rounded-full bg-brand px-6 py-3 font-lexend text-base font-semibold text-white transition-colors hover:bg-brand-600"
						onClick={globalModal.showConfirm && globalModal.onConfirm ? globalModal.onConfirm : globalModal.onClose}
					>
						{globalModal.showConfirm && globalModal.onConfirm ? "Confirmar" : "Cerrar"}
					</button>
				</div>
			</div>
		</div>
	);
}
