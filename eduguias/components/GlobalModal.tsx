"use client";

import { useRef } from "react";
import { useUiStore } from "@/stores/uiStore";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function GlobalModal() {
	const globalModal = useUiStore((state) => state.globalModal);
	const dialogRef = useRef<HTMLDivElement | null>(null);

	useEscapeKey(globalModal.visible, () => {
		globalModal.onClose?.();
	});

	useFocusTrap(dialogRef, globalModal.visible);

	if (!globalModal.visible) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6"
			onClick={(e) => {
				// Close on backdrop click (only if non-confirming)
				if (e.target === e.currentTarget && !globalModal.showConfirm) {
					globalModal.onClose?.();
				}
			}}
		>
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="global-modal-title"
				aria-describedby="global-modal-description"
				className="w-full max-w-md rounded-[35px] bg-white px-4 py-6 sm:px-2.5 sm:py-5 text-center shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
			>
				<div className="flex flex-col items-center gap-4">
					{globalModal.imageIcon ? (
						<div className="flex items-center justify-center">
							{globalModal.imageIcon}
						</div>
					) : null}

					<h2
						id="global-modal-title"
						className="font-lexend text-2xl sm:text-[30px] font-extrabold text-foreground"
					>
						{globalModal.titulo}
					</h2>

					<p
						id="global-modal-description"
						className="max-w-sm font-lexend text-base sm:text-[20px] font-normal leading-relaxed text-edu-muted"
					>
						{globalModal.descripcion}
					</p>

					<div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto sm:justify-center mt-2">
						{globalModal.showConfirm && globalModal.onConfirm ? (
							<button
								type="button"
								className="min-w-44 rounded-full border border-slate-200 bg-white px-6 py-3 font-lexend text-base font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
								onClick={() => globalModal.onClose?.()}
							>
								Cancelar
							</button>
						) : null}
						<button
							type="button"
							className="min-w-44 rounded-full bg-brand px-6 py-3 font-lexend text-base font-semibold text-white transition-colors hover:bg-brand-600"
							onClick={
								globalModal.showConfirm && globalModal.onConfirm
									? globalModal.onConfirm
									: globalModal.onClose
							}
							autoFocus
						>
							{globalModal.showConfirm && globalModal.onConfirm
								? "Confirmar"
								: "Cerrar"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
