
import Image from "next/image";

interface ColoresStepProps {
  onNext: () => void;
  onPrev: () => void;
}

export function ColoresStep({ onNext, onPrev }: ColoresStepProps) {
  return (
    <div className="flex flex-col items-center gap-8 pb-8">
      {/* Article Preview Card */}
      <div className="w-full max-w-2xl rounded-2xl border border-[rgba(203,213,225,0.5)] bg-white shadow-xl overflow-hidden">
        {/* Cover Image */}
        <div className="relative h-64 shrink-0">
          <Image
          width={100}
          height={100}
            src="https://api.builder.io/api/v1/image/assets/TEMP/25c15054254d4c8ebbe7bc971161b63902f744df?width=1276"
            alt="Explorando el Sistema Solar"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-8">
            <div className="flex flex-col gap-3">
              <span className="inline-flex px-3 py-1 rounded-full bg-[#4F46E5] text-white text-xs font-bold" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                Ciencias Naturales
              </span>
              <h1 className="text-white text-4xl font-extrabold tracking-tight" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                Explorando el Sistema Solar
              </h1>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-10 flex flex-col gap-6">
          <p className="text-[#1E293B] text-xl font-medium leading-relaxed" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            Nuestro sistema solar consiste en una estrella mediana que llamamos el Sol y los planetas Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno.
          </p>
          <p className="text-[#334155] text-lg font-normal leading-relaxed" style={{ fontFamily: "'Public Sans', sans-serif" }}>
            Incluye los planetas satélites, numerosos cometas, asteroides, y meteoroides, y el medio interplanetario. El Sol es la fuente más rica de energía electromagnética (principalmente en forma de luz y calor).
          </p>

          {/* Quiz Section */}
          <div className="pt-8 border-t border-[#F1F5F9] flex flex-col gap-4">
            <h3 className="text-[#0F172A] text-lg font-bold" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              Pregunta de Repaso
            </h3>
            <p className="text-[#1E293B] text-lg font-medium" style={{ fontFamily: "'Public Sans', sans-serif" }}>
              ¿Cuál es el planeta más grande de nuestro sistema solar?
            </p>

            <div className="pt-2 flex flex-col gap-3">
              {/* Option - Marte */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0]">
                <div className="w-4 h-4 rounded-full border border-[#CBD5E1] bg-white shrink-0" />
                <span className="text-[#334155] text-base" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                  Marte: Conocido como el planeta rojo, posee una atmósfera delgada y valles profundos.
                </span>
              </div>

              {/* Option - Júpiter (selected) */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#FACC15] bg-[rgba(250,204,21,0.1)]">
                <div className="w-4.5 h-4.5 rounded-full bg-[#FACC15] flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span className="text-[#334155] text-base" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                  Júpiter: El gigante gaseoso con su Gran Mancha Roja y docenas de lunas orbitando.
                </span>
              </div>

              {/* Option - Saturno */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0]">
                <div className="w-4 h-4 rounded-full border border-[#CBD5E1] bg-white shrink-0" />
                <span className="text-[#334155] text-base" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                  Saturno: Famoso por su espectacular sistema de anillos compuestos de hielo y polvo.
                </span>
              </div>

              {/* Option - Venus */}
              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#E2E8F0]">
                <div className="w-4 h-4 rounded-full border border-[#CBD5E1] bg-white shrink-0" />
                <span className="text-[#334155] text-base" style={{ fontFamily: "'Public Sans', sans-serif" }}>
                  Venus: El planeta más caliente del sistema solar con una atmósfera densa y sofocante.
                </span>
              </div>
            </div>

            {/* In-preview navigation */}
            <div className="flex items-center justify-between pt-2">
              <button className="h-10 px-4 rounded-lg bg-[#FACC15] font-lexend font-bold text-sm text-black hover:bg-[#e6b800] transition-colors">
                Volver a la anterior
              </button>
              <button className="h-10 px-4 rounded-lg bg-[#FACC15] font-lexend font-bold text-sm text-black hover:bg-[#e6b800] transition-colors">
                Siguiente pregunta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save & Review button */}
      <button
        onClick={onNext}
        className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#135BEC] text-white font-lexend font-bold text-base hover:bg-[#0f4fd1] transition-colors shadow-lg shadow-[rgba(19,91,236,0.2)]"
      >
        Guardar y revisar
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white"/>
        </svg>
      </button>
    </div>
  );
}
