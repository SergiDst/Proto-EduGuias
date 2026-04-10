import Image from "next/image";
import { TemplatesIcon, AccessibilityIcon, PedagogyIcon } from "@/components/HomePageIcons";

const features = [
  {
    icon: <TemplatesIcon />,
    title: "Plantillas predefinidas",
    description:
      "Estructuras listas para usar que ahorran tiempo y aseguran consistencia visual y pedagógica en tus materiales.",
  },
  {
    icon: <AccessibilityIcon />,
    title: "Asistente de accesibilidad",
    description:
      "Verificación en tiempo real del cumplimiento de estándares WCAG para asegurar que ningún alumno se quede atrás.",
  },
  {
    icon: <PedagogyIcon />,
    title: "Guía pedagógica DUA",
    description:
      "Orientación basada en el Diseño Universal para el Aprendizaje integrada directamente en tu flujo de trabajo.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-edu-bg font-lexend">

      {/* Hero Section */}
      <section className="bg-edu-bg">
        <div className="max-w-360 mx-auto px-6 lg:px-14 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left */}
            <div className="flex-1 flex flex-col gap-8 max-w-174.25">

              <div className="inline-flex items-center self-start">
                <span className="bg-brand/10 text-brand font-bold text-xs tracking-[0.6px] uppercase px-4 py-1.5 rounded-full">
                  Educación para todos
                </span>
              </div>

              <h1 className="font-extrabold text-5xl lg:text-[60px] leading-tight lg:leading-18.25 text-edu-dark">
                Crea recursos educativos{" "}
                <span className="text-brand">inclusivos</span>{" "}
                y de alta calidad
              </h1>

              <p className="text-lg leading-7 text-edu-muted max-w-142">
                Potencia tu enseñanza con herramientas diseñadas específicamente
                para la diversidad y la excelencia pedagógica.
              </p>

              <div>
                <button className="bg-brand text-white font-bold text-lg px-10 py-4 rounded-lg hover:bg-brand-600 transition-colors">
                  Empieza ahora
                </button>
              </div>
            </div>

            {/* Right */}
            <div className="shrink-0 w-full max-w-142 lg:w-142">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/9b22d9deccce9c43f2f4507bb48716e856163fa8?width=1136"
                alt="Profesores colaborando"
                width={568}
                height={568}
                loading="eager"
                className="w-full aspect-square object-cover rounded-2xl border-4 border-white shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-360 mx-auto px-6 lg:px-14 py-20 lg:py-24">

          <div className="mb-16">
            <h2 className="font-black text-[30px] leading-9 text-edu-dark mb-4">
              Diseñado para educadores modernos
            </h2>
            <p className="text-lg leading-7 text-edu-muted max-w-3xl">
              Todo lo que necesitas para crear contenido accesible y efectivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-edu-bg border border-edu-light rounded-2xl p-8 flex flex-col gap-6"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand/10">
                  {feature.icon}
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-xl text-edu-dark">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-6.5 text-edu-muted">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
