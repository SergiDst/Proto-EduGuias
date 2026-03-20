import Image from "next/image";

const LogoIcon = () => (
  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white">
    <svg
      width="22"
      height="18"
      viewBox="0 0 28 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.75 22.5L5 17.75V10.25L0 7.5L13.75 0L27.5 7.5V17.5H25V8.875L22.5 10.25V17.75L13.75 22.5ZM13.75 12.125L22.3125 7.5L13.75 2.875L5.1875 7.5L13.75 12.125ZM13.75 19.6562L20 16.2812V11.5625L13.75 15L7.5 11.5625V16.2812L13.75 19.6562Z"
        fill="#135BEC"
      />
    </svg>
  </div>
);

const CheckIcon = () => (
  <div className="w-6 h-6 flex items-center justify-center rounded-full bg-white shrink-0">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="#135BEC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const features = [
  "Access 500+ accessibility templates",
  "Collaborate with expert educators",
  "Real-time feedback on curriculum",
];

export default function AuthHeroPanel() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      
      {/* Background image */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/6225893d51baf1e1f4d5b294b787ac089114400e?width=1280"
        alt="Educators collaborating"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-brand/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-16 py-16 gap-6 max-w-140">
        
        {/* Logo */}
        <div className="flex items-center gap-3 mb-2">
          <LogoIcon />
          <span className="font-lexend font-bold text-3xl tracking-tight text-white">
            EduGuide
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-lexend font-black text-5xl leading-[1.2] text-white">
          {"Empower every student's journey."}
        </h2>

        {/* Description */}
        <p className="font-lexend text-xl leading-[1.6] text-white/90 max-w-md">
          Join a community of educators dedicated to building the future of
          inclusive learning. Start creating accessible resources today.
        </p>

        {/* Features */}
        <ul className="flex flex-col gap-6 mt-4">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <CheckIcon />
              <span className="font-lexend text-lg text-white">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}