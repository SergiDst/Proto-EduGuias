import Link from 'next/link';
import Image from "next/image";

const TemplatesIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 0H10V10H0V0ZM2.5 2.5V7.5V2.5ZM12.5 0H22.5V10H12.5V0ZM15 2.5V7.5V2.5ZM0 12.5H10V22.5H0V12.5ZM2.5 15V20V15ZM16.25 12.5H18.75V16.25H22.5V18.75H18.75V22.5H16.25V18.75H12.5V16.25H16.25V12.5ZM15 2.5V7.5H20V2.5H15ZM2.5 2.5V7.5H7.5V2.5H2.5ZM2.5 15V20H7.5V15H2.5Z"
      fill="#135BEC"
    />
  </svg>
);

const AccessibilityIcon = () => (
  <svg width="23" height="25" viewBox="0 0 23 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.25 5C10.5625 5 9.97396 4.75521 9.48438 4.26562C8.99479 3.77604 8.75 3.1875 8.75 2.5C8.75 1.8125 8.99479 1.22396 9.48438 0.734375C9.97396 0.244792 10.5625 0 11.25 0C11.9375 0 12.526 0.244792 13.0156 0.734375C13.5052 1.22396 13.75 1.8125 13.75 2.5C13.75 3.1875 13.5052 3.77604 13.0156 4.26562C12.526 4.75521 11.9375 5 11.25 5ZM7.5 25V8.75C6.25 8.64583 4.97917 8.48958 3.6875 8.28125C2.39583 8.07292 1.16667 7.8125 0 7.5L0.625 5C2.25 5.4375 3.97917 5.75521 5.8125 5.95312C7.64583 6.15104 9.45833 6.25 11.25 6.25C13.0417 6.25 14.8542 6.15104 16.6875 5.95312C18.5208 5.75521 20.25 5.4375 21.875 5L22.5 7.5C21.3333 7.8125 20.1042 8.07292 18.8125 8.28125C17.5208 8.48958 16.25 8.64583 15 8.75V25H12.5V17.5H10V25H7.5Z"
      fill="#135BEC"
    />
  </svg>
);

const PedagogyIcon = () => (
  <svg width="28" height="23" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M13.75 22.5L5 17.75V10.25L0 7.5L13.75 0L27.5 7.5V17.5H25V8.875L22.5 10.25V17.75L13.75 22.5ZM13.75 12.125L22.3125 7.5L13.75 2.875L5.1875 7.5L13.75 12.125ZM13.75 19.6562L20 16.2812V11.5625L13.75 15L7.5 11.5625V16.2812L13.75 19.6562Z"
      fill="#135BEC"
    />
  </svg>
);

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
        <div className="max-w-[1440px] mx-auto px-6 lg:px-14 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left */}
            <div className="flex-1 flex flex-col gap-8 max-w-[697px]">

              <div className="inline-flex items-center self-start">
                <span className="bg-brand/10 text-brand font-bold text-xs tracking-[0.6px] uppercase px-4 py-1.5 rounded-full">
                  Educación para todos
                </span>
              </div>

              <h1 className="font-extrabold text-5xl lg:text-[60px] leading-tight lg:leading-[73px] text-edu-dark">
                Crea recursos educativos{" "}
                <span className="text-brand">inclusivos</span>{" "}
                y de alta calidad
              </h1>

              <p className="text-lg leading-[28px] text-edu-muted max-w-[568px]">
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
            <div className="flex-shrink-0 w-full max-w-[568px] lg:w-[568px]">
              <Image
                src="https://api.builder.io/api/v1/image/assets/TEMP/9b22d9deccce9c43f2f4507bb48716e856163fa8?width=1136"
                alt="Profesores colaborando"
                width={568}
                height={568}
                className="w-full aspect-square object-cover rounded-2xl border-4 border-white shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-14 py-20 lg:py-24">

          <div className="mb-16">
            <h2 className="font-black text-[30px] leading-9 text-edu-dark mb-4">
              Diseñado para educadores modernos
            </h2>
            <p className="text-lg leading-7 text-edu-muted max-w-[768px]">
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
                  <p className="text-base leading-[26px] text-edu-muted">
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
