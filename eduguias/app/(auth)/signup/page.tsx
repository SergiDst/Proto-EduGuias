"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthHeroPanel from "@/components/AuthHeroPanel";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { UserIcon, EmailIcon, LockIcon, EyeIcon, ArrowIcon } from "@/components/AuthIcons";

export default function Signup() {
    type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

    const router = useRouter();

    const setGlobalModal = useUiStore((state) => state.setGlobalModal);
    const signUp = useAuthStore((state) => state.signUp);

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const closeGlobalModal = () => {
        setGlobalModal({ visible: false });
    }

    const handleSignup = async (event: FormSubmitEvent) => {
        event.preventDefault();

        if (!name || !email || !password) {
            setGlobalModal({
                    titulo: "Campos incompletos",
                    descripcion: "Por favor, completa todos los campos para poder continuar.",
                    visible: true,
                    onClose: () => {
                        closeGlobalModal();
                    },
                    imageIcon: (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12l2 2 4-4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="9.25" stroke="#22C55E" strokeWidth="1.5" />
                        </svg>
                    ),
                });
            return;
        }

        setIsLoading(true);
        try {
            await signUp(email, password).then(() => {
                setGlobalModal({
                    titulo: "Cuenta creada",
                    descripcion: "Tu cuenta ha sido creada exitosamente. Por favor, verifica tu correo para activar tu cuenta.",
                    visible: true,
                    onClose: () => {
                        closeGlobalModal();
                        router.replace("/login");
                    },
                    imageIcon: (
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12l2 2 4-4" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="9.25" stroke="#22C55E" strokeWidth="1.5" />
                        </svg>
                    ),
                });
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo crear la cuenta.";
            setGlobalModal({
                titulo: "No se pudo crear la cuenta",
                descripcion: message,
                visible: true,
                onClose: () => {
                    closeGlobalModal();
                },
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-edu-bg font-lexend">

            {/* Left: Hero */}
            <div className="hidden lg:block w-160 shrink-0">
                <AuthHeroPanel />
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center px-8 py-16">
                <div className="w-full max-w-md flex flex-col gap-8">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 self-start px-4 py-3 rounded-xl bg-brand text-white font-bold text-sm shadow-[0_10px_15px_-3px_rgba(19,91,236,0.25),0_4px_6px_-4px_rgba(19,91,236,0.25)] hover:bg-brand-600 transition"
                    >
                        <span aria-hidden="true">←</span>
                        <span>Volver al inicio</span>
                    </Link>

                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-lexend font-extrabold text-[30px] leading-9 tracking-tight text-edu-dark">
                            Crear cuenta
                        </h1>
                        <p className="font-lexend font-normal text-sm leading-5 text-edu-muted">
                            Inicia la creación de actividades accesibles hoy.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="flex flex-col gap-5" onSubmit={handleSignup}>
                        {/* Full name */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-lexend font-semibold text-sm text-[#334155]">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <UserIcon />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    className="w-full pl-12 pr-4 py-4.5 rounded-xl border border-[#E2E8F0] bg-white text-base font-lexend text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-lexend font-semibold text-sm text-[#334155]">
                                Correo electronico
                            </label>
                            <div className="relative">
                                <EmailIcon />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-4.5 rounded-xl border border-[#E2E8F0] bg-white text-base font-lexend text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-lexend font-semibold text-sm text-[#334155]">
                                Contraseña
                            </label>
                            <div className="relative">
                                <LockIcon />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4.5 rounded-xl border border-[#E2E8F0] bg-white text-base font-lexend text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-edu-muted transition"
                                >
                                    <EyeIcon visible={showPassword} />
                                </button>
                            </div>
                            <p className="font-lexend font-normal text-xs text-edu-muted mt-0.5">
                                Debe contener al menos 8 caracteres y un numero o caracter especial
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand text-white font-lexend font-bold text-base shadow-[0_10px_15px_-3px_rgba(19,91,236,0.25),0_4px_6px_-4px_rgba(19,91,236,0.25)] hover:bg-brand-600 transition"
                        >
                            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                            <ArrowIcon />
                        </button>
                    </form>

                    {/* Divider + login link */}
                    <div className="border-t border-[#E2E8F0] pt-6 flex items-center justify-center gap-1">
                        <span className="font-lexend font-normal text-base text-edu-muted">
                            ¿Ya tienes una cuenta?
                        </span>
                        <Link
                            href="/login"
                            className="font-lexend font-bold text-base text-brand hover:underline"
                        >
                            Inicia sesión aqui
                        </Link>
                    </div>

                </div>
            </div>


        </div>
    );
}