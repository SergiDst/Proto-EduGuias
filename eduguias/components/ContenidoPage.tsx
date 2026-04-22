interface ContenidoStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function ContenidoStep({ onNext, onPrev }: ContenidoStepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="font-lexend text-3xl font-bold text-[#0F172A]">
          Contenido del cuestionario
        </h2>
        <p className="font-lexend text-base text-[#64748B]">
          Paso 2 de 5: Construye las preguntas y respuestas del cuestionario
        </p>
      </div>

      {/* Main Content Card */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 shadow-sm">
        <div className="space-y-8">
          {/* Question Title */}
          <div className="space-y-3">
            <label className="font-lexend text-sm font-bold text-[#334155]">
              Titulo de la pregunta
            </label>
            <textarea
              className="w-full min-h-32 p-4 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-base text-[#6B7280] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
              placeholder="Escriba un titulo descriptivo para la pregunta"
            />
          </div>

          {/* Media Upload */}
          <div className="space-y-3">
            <label className="font-lexend text-sm font-bold text-[#334155]">
              Imagen de soporte (opcional)
            </label>
            <div className="rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 flex flex-col items-center justify-center gap-2">
              <svg width="30" height="32" viewBox="0 0 30 32" fill="none">
                <path d="M6 12H9V9H6V12ZM12 12H15V9H12V12ZM18 18H21V15H18V18ZM18 12H21V9H18V12ZM3 24C2.175 24 1.46875 23.7062 0.88125 23.1187C0.29375 22.5312 0 21.825 0 21V3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0H27C27.825 0 28.5312 0.29375 29.1187 0.88125C29.7062 1.46875 30 2.175 30 3V21C30 21.825 29.7062 22.5312 29.1187 23.1187C28.5312 23.7062 27.825 24 27 24H3ZM3 21H27V3H3V21ZM3 21V3V21Z" fill="#94A3B8"/>
              </svg>
              <p className="font-lexend text-sm text-[#64748B] text-center">
                Arrastra y suelta o presiona para cargar una imagen
              </p>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 pt-4 border-t border-[#F1F5F9]">
            <label className="font-lexend text-sm font-bold text-[#334155] block">
              Respuesta correcta
            </label>

            {/* Correct Answer Option */}
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="option1"
                name="correct"
                defaultChecked
                className="w-5 h-5 rounded-full border border-[#CBD5E1] cursor-pointer"
              />
              <input
                type="text"
                defaultValue="Opción 1"
                className="flex-1 px-3 py-3.5 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-base text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
              />
            </div>

            {/* Other Answer Options */}
            <div className="space-y-4">
              <label className="font-lexend text-sm font-bold text-[#334155] block">
                Opciones de respuesta
              </label>

              {[2, 3, 4].map((num) => (
                <div key={num} className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={`option${num}`}
                    name="correct"
                    className="w-5 h-5 rounded-full border border-[#CBD5E1] cursor-pointer"
                  />
                  <input
                    type="text"
                    defaultValue={`Opción ${num}`}
                    className="flex-1 px-3 py-3.5 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-base text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
                  />
                  <button className="p-2 hover:bg-[#F8FAFC] rounded transition-colors">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                      <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14ZM3 3V16V3Z" fill="#94A3B8"/>
                    </svg>
                  </button>
                </div>
              ))}

              <button className="flex items-center gap-2 px-3 py-2 text-[#135BEC] font-lexend font-bold text-sm hover:bg-[#EEF2FF] rounded transition-colors">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M5.25 8.75H6.41667V6.41667H8.75V5.25H6.41667V2.91667H5.25V5.25H2.91667V6.41667H5.25V8.75ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667ZM5.83333 10.5C7.13611 10.5 8.23958 10.0479 9.14375 9.14375C10.0479 8.23958 10.5 7.13611 10.5 5.83333C10.5 4.53056 10.0479 3.42708 9.14375 2.52292C8.23958 1.61875 7.13611 1.16667 5.83333 1.16667C4.53056 1.16667 3.42708 1.61875 2.52292 2.52292C1.61875 3.42708 1.16667 4.53056 1.16667 5.83333C1.16667 7.13611 1.61875 8.23958 2.52292 9.14375C3.42708 10.0479 4.53056 10.5 5.83333 10.5Z" fill="#135BEC"/>
                </svg>
                Añadir opción
              </button>
            </div>
          </div>

          {/* Explanation */}
          <div className="space-y-3 pt-4 border-t border-[#F1F5F9]">
            <label className="font-lexend text-sm font-bold text-[#334155]">
              Explicación de respuesta correcta
            </label>
            <textarea
              className="w-full min-h-20 p-4 rounded-lg border border-[#E2E8F0] bg-white font-lexend text-sm text-[#6B7280] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#135BEC] focus:border-transparent"
              placeholder="Escriba un contexto de porque la respuesta es correcta"
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        
      </div>

      <div className="flex justify-between items-center gap-4 pt-8 border-t border-[#F1F5F9]">
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#E2E8F0] text-[#475569] font-lexend font-bold text-base hover:bg-[#F8FAFC] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#475569"/>
            </svg>
            Volver atras
          </button>
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

      {/* Question Number Indicators */}
      {/* <div className="flex items-start gap-2 absolute right-8 top-24">
        <div className="w-10 h-10 rounded-full bg-[#135BEC] flex items-center justify-center">
          <span className="font-lexend font-bold text-lg text-white">1</span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-lexend font-bold text-[#0F172A]">2</div>
        </div>
        <div className="w-10 h-10 rounded-full border-2 border-[#0F172A] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 14.4L3.2 9.6L4.6 8.2L8 11.6L11.4 8.2L12.8 9.6L8 14.4ZM8 0C8.55 0 9 0.45 9 1V7H7V1C7 0.45 7.45 0 8 0Z" fill="#0F172A"/>
          </svg>
        </div>
      </div> */}
    </div>
  );
}
