'use client'

import { useRef, useState } from "react";
import { PerfilIcon, PreferenciasIcon } from "@/components/SettingsIcons";
import { Toggle } from "@/components/Toggle";

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
