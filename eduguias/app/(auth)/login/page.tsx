"use client";

import { useState, type ComponentProps } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthHeroPanel from "@/components/AuthHeroPanel";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

const EmailIcon = () => (
    <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const LockIcon = () => (
    <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
    visible ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" stroke="#94A3B8" strokeWidth="1.5" />
        </svg>
    )
);

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

function getLoginErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    return "No se pudo iniciar sesión.";
}

export default function Login() {
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
                                className={`w-4 h-4 rounded border flex items-center justify-center transition ${remember
                                    ? "bg-brand border-brand"
                                    : "bg-white border-[#CBD5E1]"
                                    }`}
                            >
                                {remember && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M4.5 12.75l6 6 9-13.5"
                                            stroke="white"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                )}
                            </button>

                            <span className="text-sm text-[#334155]">
                                Recordar sesión
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-brand text-white font-bold text-base shadow-[0_10px_15px_-3px_rgba(19,91,236,0.25),0_4px_6px_-4px_rgba(19,91,236,0.25)] hover:bg-brand-600 transition"
                        >
                            {isLoading ? "Ingresando..." : "Iniciar sesión"}
                            <ArrowIcon />
                        </button>

                    </form>

                    {/* Footer */}
                    <div className="border-t border-[#E2E8F0] pt-6 flex items-center justify-center gap-1">
                        <span className="text-base text-edu-muted">
                            ¿No tienes una cuenta?
                        </span>

                        <Link
                            href="/signup"
                            className="font-bold text-base text-brand hover:underline"
                        >
                            Crea tu cuenta aquí
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right: Hero */}
            <div className="hidden lg:block w-160 shrink-0">
                <AuthHeroPanel />
            </div>
        </div>
    );
}