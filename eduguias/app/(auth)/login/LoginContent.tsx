"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeroPanel from "@/components/AuthHeroPanel";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { EmailIcon, LockIcon, EyeIcon, ArrowIcon } from "@/components/AuthIcons";

function getLoginErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "No se pudo iniciar sesión.";
}

export function LoginContent() {
    type FormSubmitEvent = Parameters<NonNullable<ComponentProps<"form">["onSubmit"]>>[0];

    const router = useRouter();
    const searchParams = useSearchParams();

    const setGlobalModal = useUiStore((state) => state.setGlobalModal);
    const login = useAuthStore((state) => state.login);
    const setSessionPersistence = useAuthStore((state) => state.setSessionPersistence);

    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (event: FormSubmitEvent) => {
        event.preventDefault();
        const nextRoute = searchParams.get("next");
        const destination = nextRoute ?? "/inicio";
        let isSuccess = false;

        if (!email || !password) {
            setGlobalModal({
                titulo: "Campos incompletos",
                descripcion: "Por favor completa correo y contraseña para iniciar sesión.",
                visible: true,
                onClose: () => setGlobalModal({ visible: false }),
            });
            return;
        }

        setIsLoading(true);
        try {
            await setSessionPersistence(remember);
            await login(email, password);
            document.cookie = "eduguias-auth=1; path=/; max-age=2592000; samesite=lax";
            isSuccess = true;
        } catch (error) {
            const message = getLoginErrorMessage(error);
            setGlobalModal({
                titulo: "Error al iniciar sesión",
                descripcion: message,
                visible: true,
                onClose: () => setGlobalModal({ visible: false }),
            });
        }

        if (isSuccess) {
            router.push(destination);
        }

        setIsLoading(false);
    };

    return (
        <div className="flex min-h-screen bg-edu-bg font-lexend">

            {/* Left: Form */}
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
                        <h1 className="font-extrabold text-[30px] leading-9 tracking-tight text-edu-dark">
                            Inicio de sesión
                        </h1>
                        <p className="text-sm leading-5 text-edu-muted">
                            Por favor completa los campos para ingresar a tu cuenta.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={handleLogin}
                    >

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-sm text-[#334155]">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <EmailIcon />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full pl-12 pr-4 py-4.5 rounded-xl border border-[#E2E8F0] bg-white text-base text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="font-semibold text-sm text-[#334155]">
                                Contraseña
                            </label>
                            <div className="relative">
                                <LockIcon />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-12 py-4.5 rounded-xl border border-[#E2E8F0] bg-white text-base text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-edu-muted transition"
                                >
                                    <EyeIcon visible={showPassword} />
                                </button>
                            </div>
                        </div>

                        {/* Remember */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setRemember(!remember)}
                                className="inline-flex items-center justify-center w-5 h-5 rounded border border-[#CBD5E1] bg-white transition"
                            >
                                {remember && (
                                    <svg className="w-3.5 h-3.5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                            <label className="text-sm text-[#6B7280]">
                                Recuérdame en este dispositivo
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4.5 px-4 rounded-xl bg-brand text-white font-bold text-base shadow-[0_10px_15px_-3px_rgba(19,91,236,0.25),0_4px_6px_-4px_rgba(19,91,236,0.25)] hover:bg-brand-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <span>Inicia sesión</span>
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <ArrowIcon />
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-3">
                        <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
                        <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
                    </div>


                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-[#6B7280]">
                        ¿No tienes cuenta?{" "}
                        <Link href="/signup" className="text-brand font-semibold hover:underline">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right: Hero Panel */}
            <div className="hidden lg:flex flex-1">
                <AuthHeroPanel />
            </div>
        </div>
    );
}
