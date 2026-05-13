'use client'

import { useEffect, useMemo, useRef, useState } from "react";
import { PerfilIcon, PreferenciasIcon } from "@/components/SettingsIcons";
import { useAuthStore } from "@/stores/authStore";
import { useUserProfileStore } from "@/stores/userProfileStore";
import { useUiStore } from "@/stores/uiStore";
import { LANGUAGES, SETTINGS_TRANSLATIONS, AppLanguage } from "@/constants/i18n";

type Banner = { type: "success" | "error"; text: string } | null;

export default function Ajustes() {
  const user = useAuthStore((state) => state.user);
  const changeEmail = useAuthStore((state) => state.changeEmail);
  const changePassword = useAuthStore((state) => state.changePassword);

  const profile = useUserProfileStore((state) => state.profile);
  const fetchProfile = useUserProfileStore((state) => state.fetchProfile);
  const saveProfile = useUserProfileStore((state) => state.saveProfile);
  const setLanguage = useUserProfileStore((state) => state.setLanguage);

  const setGlobalModal = useUiStore((state) => state.setGlobalModal);

  const [activeTab, setActiveTab] = useState<"perfil" | "preferencias">("perfil");
  const language: AppLanguage = (profile?.Idioma as AppLanguage) ?? "es";
  const t = useMemo(() => SETTINGS_TRANSLATIONS[language], [language]);

  // Form state
  const [apodo, setApodo] = useState("");
  const [email, setEmail] = useState("");
  const [currentPasswordEmail, setCurrentPasswordEmail] = useState("");
  const [currentPasswordPwd, setCurrentPasswordPwd] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [savingNickname, setSavingNickname] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [banner, setBanner] = useState<Banner>(null);

  const preferenciasSectionRef = useRef<HTMLDivElement>(null);
  const perfilSectionRef = useRef<HTMLDivElement>(null);

  // Fetch profile + hydrate form
  useEffect(() => {
    if (user?.uid) fetchProfile(user.uid).catch(() => undefined);
  }, [user?.uid, fetchProfile]);

  useEffect(() => {
    if (profile) setApodo(profile.Apodo ?? "");
  }, [profile?.Apodo, profile]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user?.email]);

  const handleTabClick = (tab: "perfil" | "preferencias") => {
    setActiveTab(tab);
    if (tab === "preferencias") {
      preferenciasSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      perfilSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showBanner = (b: Banner) => {
    setBanner(b);
    if (b) setTimeout(() => setBanner(null), 4000);
  };

  const handleSaveNickname = async () => {
    if (!user?.uid) return;
    if (apodo.trim().length === 0) {
      showBanner({ type: "error", text: language === "es" ? "El apodo no puede estar vacío." : "Nickname cannot be empty." });
      return;
    }
    setSavingNickname(true);
    try {
      await saveProfile(user.uid, { Apodo: apodo.trim() });
      showBanner({ type: "success", text: t.savedNickname });
    } catch (e) {
      showBanner({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setSavingNickname(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!user) return;
    if (email.trim() === user.email) {
      showBanner({ type: "error", text: language === "es" ? "El correo no ha cambiado." : "Email unchanged." });
      return;
    }
    if (currentPasswordEmail.length === 0) {
      showBanner({ type: "error", text: language === "es" ? "Ingresa tu contraseña actual." : "Enter your current password." });
      return;
    }
    setSavingEmail(true);
    try {
      await changeEmail(currentPasswordEmail, email.trim());
      setCurrentPasswordEmail("");
      showBanner({ type: "success", text: t.savedEmail });
    } catch (e) {
      showBanner({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSavePassword = async () => {
    if (!user) return;
    if (newPassword.length < 6) {
      showBanner({ type: "error", text: language === "es" ? "La nueva contraseña debe tener al menos 6 caracteres." : "New password must be at least 6 characters." });
      return;
    }
    if (currentPasswordPwd.length === 0) {
      showBanner({ type: "error", text: language === "es" ? "Ingresa tu contraseña actual." : "Enter your current password." });
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(currentPasswordPwd, newPassword);
      setCurrentPasswordPwd("");
      setNewPassword("");
      showBanner({ type: "success", text: t.savedPassword });
    } catch (e) {
      showBanner({ type: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLanguageChange = async (lang: AppLanguage) => {
    setLanguage(lang);
    if (user?.uid) {
      try {
        await saveProfile(user.uid, { Idioma: lang });
      } catch {
        // silent — optimistic UI is already updated
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F8] font-[Lexend]">
      <main id="main-content" className="max-w-360 mx-auto px-4 sm:px-6 lg:px-60 py-8 sm:py-12">
        {/* Hero */}
        <div className="mb-6">
          <h1 className="font-[Lexend] text-[36px] font-black text-[#0F172A] leading-tight tracking-[-1.188px] mb-2">
            {t.title}
          </h1>
          <p className="font-[Lexend] text-base font-normal text-[#475569] leading-6">
            {t.subtitle}
          </p>
        </div>

        {/* Banner */}
        {banner ? (
          <div className={`mb-6 rounded-xl border px-4 py-3 flex items-center gap-2 ${
            banner.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              {banner.type === "success" ? (
                <>
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M5.5 9l2.5 2.5L12.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
              ) : (
                <>
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9 5.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="12" r="0.75" fill="currentColor" />
                </>
              )}
            </svg>
            <span className="font-[Lexend] text-sm">{banner.text}</span>
          </div>
        ) : null}

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
            {t.tabProfile}
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
            {t.tabPreferences}
          </button>
        </div>

        {/* Perfil card */}
        <div
          ref={perfilSectionRef}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 mb-6"
        >
          <div className="mb-8">
            <h2 className="font-[Lexend] text-lg font-bold text-[#0F172A] leading-snug mb-1">
              {t.profileTitle}
            </h2>
            <p className="font-[Lexend] text-sm text-[#475569] leading-5">
              {t.profileSubtitle}
            </p>
          </div>

          {/* Nickname row */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-[Lexend] text-sm font-medium text-[#0F172A]">
              {t.nicknameLabel}
            </label>
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                value={apodo}
                onChange={(e) => setApodo(e.target.value)}
                className="flex-1 font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
                placeholder={language === "es" ? "Tu apodo o nombre visible" : "Your nickname or visible name"}
              />
              <button
                onClick={handleSaveNickname}
                disabled={savingNickname || !user}
                className={`shrink-0 font-[Lexend] text-sm font-bold text-white rounded-xl px-6 py-3 transition-colors ${
                  savingNickname ? "bg-[#94A3B8] cursor-not-allowed" : "bg-[#135BEC] hover:bg-blue-700"
                }`}
              >
                {savingNickname ? t.saving : t.saveButton}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 my-6" />

          {/* Email row */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-[Lexend] text-sm font-medium text-[#0F172A]">
              {t.emailLabel}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
              placeholder="ejemplo@correo.com"
            />
            <p className="font-[Lexend] text-xs text-[#94A3B8] mt-1">
              {t.emailHelper}
            </p>
            <div className="flex flex-col md:flex-row gap-3 mt-2">
              <input
                type="password"
                value={currentPasswordEmail}
                onChange={(e) => setCurrentPasswordEmail(e.target.value)}
                className="flex-1 font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
                placeholder={t.currentPasswordLabel}
                autoComplete="current-password"
              />
              <button
                onClick={handleSaveEmail}
                disabled={savingEmail || !user}
                className={`shrink-0 font-[Lexend] text-sm font-bold text-white rounded-xl px-6 py-3 transition-colors ${
                  savingEmail ? "bg-[#94A3B8] cursor-not-allowed" : "bg-[#135BEC] hover:bg-blue-700"
                }`}
              >
                {savingEmail ? t.saving : t.saveButton}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 my-6" />

          {/* Password row */}
          <div className="flex flex-col gap-2">
            <label className="font-[Lexend] text-sm font-medium text-[#0F172A]">
              {t.passwordLabel}
            </label>
            <p className="font-[Lexend] text-xs text-[#94A3B8] mb-1">
              {t.passwordHelper}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
              <input
                type="password"
                value={currentPasswordPwd}
                onChange={(e) => setCurrentPasswordPwd(e.target.value)}
                className="font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
                placeholder={t.currentPasswordLabel}
                autoComplete="current-password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors"
                placeholder={t.newPasswordLabel}
                autoComplete="new-password"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSavePassword}
                disabled={savingPassword || !user}
                className={`font-[Lexend] text-sm font-bold text-white rounded-xl px-6 py-3 transition-colors ${
                  savingPassword ? "bg-[#94A3B8] cursor-not-allowed" : "bg-[#135BEC] hover:bg-blue-700"
                }`}
              >
                {savingPassword ? t.saving : t.saveButton}
              </button>
            </div>
          </div>
        </div>

        {/* Preferencias card */}
        <div
          ref={preferenciasSectionRef}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8"
        >
          <div className="mb-8">
            <h2 className="font-[Lexend] text-lg font-bold text-[#0F172A] leading-snug mb-1">
              {t.preferencesTitle}
            </h2>
            <p className="font-[Lexend] text-sm text-[#475569] leading-5">
              {t.preferencesSubtitle}
            </p>
          </div>

          {/* Language */}
          <div>
            <label className="block font-[Lexend] text-sm font-medium text-[#0F172A] mb-2">
              {t.languageLabel}
            </label>
            <div className="relative w-full max-w-xs">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as AppLanguage)}
                className="appearance-none w-full font-[Lexend] text-sm text-[#0F172A] bg-white border border-slate-200 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#135BEC]/30 focus:border-[#135BEC] transition-colors cursor-pointer"
              >
                {(Object.keys(LANGUAGES) as AppLanguage[]).map((code) => (
                  <option key={code} value={code}>
                    {LANGUAGES[code].flag} {LANGUAGES[code].label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="#475569"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
