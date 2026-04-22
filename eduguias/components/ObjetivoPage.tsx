interface ObjetivoStepProps {
  onNext: () => void;
}

export function ObjetivoStep({ onNext }: ObjetivoStepProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-lexend text-3xl font-bold text-[#0F172A]">
          Define tus objetivos
        </h1>
        <p className="font-lexend text-base text-[#64748B]">
          Establece la base de tu cuestionario especificando qué deben aprender los estudiantes y para quién es la evaluación.
        </p>
      </div>

      {/* Learning Objective Input */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <label className="font-lexend text-sm font-bold text-[#334155]">
            Objetivo de aprendizaje
          </label>
          <textarea
            className="w-full min-h-40 p-4 rounded-xl border border-[#E2E8F0] bg-white font-lexend text-base text-[#94A3B8] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
            placeholder="Ej: Al final de este cuestionario, los estudiantes podrán identificar las tres leyes primarias de la termodinámica y aplicarlas a sistemas mecánicos simples."
          />
          <p className="font-lexend text-xs text-[#94A3B8]">
            Intenta ser lo más específico posible sobre los resultados deseados.
          </p>
        </div>

        {/* Next Button */}
        <div className="flex justify-end pt-8">
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#135BEC] text-white font-lexend font-bold text-base hover:bg-[#0f4fd1] transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)]"
          >
            Siguiente
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
