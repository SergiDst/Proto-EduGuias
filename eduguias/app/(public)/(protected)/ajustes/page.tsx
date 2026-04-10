'use client'

import { useRef, useState } from "react";

function PerfilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 20V17.2C4 16.6333 4.14583 16.1125 4.4375 15.6375C4.72917 15.1625 5.11667 14.8 5.6 14.55C6.63333 14.0333 7.68333 13.6458 8.75 13.3875C9.81667 13.1292 10.9 13 12 13C13.1 13 14.1833 13.1292 15.25 13.3875C16.3167 13.6458 17.3667 14.0333 18.4 14.55C18.8833 14.8 19.2708 15.1625 19.5625 15.6375C19.8542 16.1125 20 16.6333 20 17.2V20H4Z" fill="currentColor"/>
    </svg>
  );
}

function PreferenciasIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 18V12H10V14H18V16H10V18H8ZM0 16V14H6V16H0ZM4 12V10H0V8H4V6H6V12H4ZM8 10V8H18V10H8ZM12 6V0H14V2H18V4H14V6H12ZM0 4V2H10V4H0Z" fill="currentColor"/>
    </svg>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 ${
        checked ? "bg-[#135BEC]" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function Ajustes() {
  const [activeTab, setActiveTab] = useState<"perfil" | "preferencias">("perfil");
  const [colorBlindMode, setColorBlindMode] = useState(false);

  const [form, setForm] = useState({
    apodo: "Dr. Sarah Miller",
    correo: "sarah.miller@university.edu",
    institucion: "Global Institute of Technology",
  });

  const preferenciasSectionRef = useRef<HTMLDivElement>(null);
  const perfilSectionRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: "perfil" | "preferencias") => {
    setActiveTab(tab);
    if (tab === "preferencias") {
      preferenciasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      perfilSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F8] font-[Lexend]">
      <main className="max-w-360 mx-auto px-6 lg:px-60 py-12">
        {/* Hero */}
        <div className="mb-6">
          <h1 className="font-[Lexend] text-[36px] font-black text-[#0F172A] leading-tight tracking-[-1.188px] mb-2">
            Ajustes
          </h1>
          <p className="font-[Lexend] text-base font-normal text-[#475569] leading-6">
            Personaliza la información de tu perfil y tus preferencias
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-6 mb-8 border-b border-slate-200">
          <button
            onClick={() => handleTabClick("perfil")}
            className={`flex items-center gap-2 pb-3 font-[Lexend] text-sm font-medium leading-5 border-b-2 transition-colors -mb-px ${
              activeTab === "perfil"
                ? "text-[#135BEC] border-[#135BEC]"
                : "text-[#475569] border-transparent hover:text-[#0F172A]"
            }`}
          >
            <PerfilIcon />
            Perfil
          </button>
          <button
            onClick={() => handleTabClick("preferencias")}
            className={`flex items-center gap-2 pb-3 font-[Lexend] text-sm font-medium leading-5 border-b-2 transition-colors -mb-px ${
              activeTab === "preferencias"
                ? "text-[#135BEC] border-[#135BEC]"
                : "text-[#475569] border-transparent hover:text-[#0F172A]"
            }`}
          >
            <PreferenciasIcon />
            Preferencias
          </button>
        </div>

        {/* Perfil card */}
        <div
          ref={perfilSectionRef}
          className="bg-white rounded-2xl border border-slate-200 p-8 mb-6"
        >
          <div className="mb-8">
            <h2 className="font-[Lexend] text-lg font-bold text-[#0F172A] leading-snug mb-1">
              Información de perfil
            </h2>
            <p className="font-[Lexend] text-sm text-[#475569] leading-5">
              Actualiza la información de tu cuenta con los datos mas recientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Apodo */}
            <div className="flex flex-col gap-2">
              <label className="font-[Lexend] text-sm font-medium text-[#0F172A]">
                Apodo
              </label>
              <input
                type="text"
                value={form.apodo}
                onChange={(e) => setForm({ ...form, apodo: e.target.value })}
                className="font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
              />
            </div>

            {/* Correo electronico */}
            <div className="flex flex-col gap-2">
              <label className="font-[Lexend] text-sm font-medium text-[#0F172A]">
                Correo electronico
              </label>
              <input
                type="email"
                value={form.correo}
                onChange={(e) => setForm({ ...form, correo: e.target.value })}
                className="font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
              />
            </div>
          </div>

          {/* Institución */}
          <div className="flex flex-col gap-2 mb-8">
            <label className="font-[Lexend] text-sm font-medium text-[#0F172A]">
              Institución
            </label>
            <input
              type="text"
              value={form.institucion}
              onChange={(e) => setForm({ ...form, institucion: e.target.value })}
              className="font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button className="font-[Lexend] text-sm font-bold text-white bg-[#135BEC] rounded-xl px-6 py-3 hover:bg-blue-700 transition-colors shadow-[0_4px_6px_-1px_rgba(19,91,236,0.20)]">
              Guardar cambios
            </button>
          </div>
        </div>

        {/* Preferencias card */}
        <div
          ref={preferenciasSectionRef}
          className="bg-white rounded-2xl border border-slate-200 p-8"
        >
          <div className="mb-8">
            <h2 className="font-[Lexend] text-lg font-bold text-[#0F172A] leading-snug mb-1">
              Preferencias
            </h2>
            <p className="font-[Lexend] text-sm text-[#475569] leading-5">
              Customiza como deben comportarse aspectos específicos de la plataforma
            </p>
          </div>

          {/* Language */}
          <div className="mb-8">
            <label className="block font-[Lexend] text-sm font-medium text-[#0F172A] mb-2">
              Lenguaje por defecto
            </label>
            <div className="relative w-full max-w-xs">
              <select className="appearance-none w-full font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors cursor-pointer">
                <option>Español (ES)</option>
                <option>English (EN)</option>
                <option>Português (PT)</option>
                <option>Français (FR)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="#475569"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div>
            <h3 className="font-[Lexend] text-sm font-semibold text-[#0F172A] mb-4">
              Accesibilidad
            </h3>

            {/* Color blind mode toggle */}
            <div className="flex items-center justify-between py-4 border-t border-slate-100">
              <div>
                <p className="font-[Lexend] text-sm font-medium text-[#0F172A] mb-0.5">
                  Modo de daltonismo
                </p>
                <p className="font-[Lexend] text-sm text-[#475569]">
                  Aplicar paletas de color con alto contraste
                </p>
              </div>
              <Toggle checked={colorBlindMode} onChange={setColorBlindMode} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
