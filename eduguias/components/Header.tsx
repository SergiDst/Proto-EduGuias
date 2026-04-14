'use client'

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";

const LogoIcon = () => (
    <svg width="28" height="23" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M13.75 22.5L5 17.75V10.25L0 7.5L13.75 0L27.5 7.5V17.5H25V8.875L22.5 10.25V17.75L13.75 22.5ZM13.75 12.125L22.3125 7.5L13.75 2.875L5.1875 7.5L13.75 12.125ZM13.75 19.6562L20 16.2812V11.5625L13.75 15L7.5 11.5625V16.2812L13.75 19.6562Z"
            fill="#135BEC"
        />
    </svg>
);

const LoginIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 21V19H19V5H12V3H19C19.55 3 20.0208 3.19583 20.4125 3.5875C20.8042 3.97917 21 4.45 21 5V19C21 19.55 20.8042 20.0208 20.4125 20.4125C20.0208 20.8042 19.55 21 19 21H12ZM10 17L8.625 15.55L11.175 13H3V11H11.175L8.625 8.45L10 7L15 12L10 17Z"
            fill="white"
        />
    </svg>
);

const RegisterIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18 14V11H15V9H18V6H20V9H23V11H20V14H18ZM6.175 10.825C5.39167 10.0417 5 9.1 5 8C5 6.9 5.39167 5.95833 6.175 5.175C6.95833 4.39167 7.9 4 9 4C10.1 4 11.0417 4.39167 11.825 5.175C12.6083 5.95833 13 6.9 13 8C13 9.1 12.6083 10.0417 11.825 10.825C11.0417 11.6083 10.1 12 9 12C7.9 12 6.95833 11.6083 6.175 10.825ZM1 20V17.2C1 16.6333 1.14583 16.1125 1.4375 15.6375C1.72917 15.1625 2.11667 14.8 2.6 14.55C3.63333 14.0333 4.68333 13.6458 5.75 13.3875C6.81667 13.1292 7.9 13 9 13C10.1 13 11.1833 13.1292 12.25 13.3875C13.3167 13.6458 14.3667 14.0333 15.4 14.55C15.8833 14.8 16.2708 15.1625 16.5625 15.6375C16.8542 16.1125 17 16.6333 17 17.2V20H1ZM3 18H15V17.2C15 17.0167 14.9542 16.85 14.8625 16.7C14.7708 16.55 14.65 16.4333 14.5 16.35C13.6 15.9 12.6917 15.5625 11.775 15.3375C10.8583 15.1125 9.93333 15 9 15C8.06667 15 7.14167 15.1125 6.225 15.3375C5.30833 15.5625 4.4 15.9 3.5 16.35C3.35 16.4333 3.22917 16.55 3.1375 16.7C3.04583 16.85 3 17.0167 3 17.2V18ZM10.4125 9.4125C10.8042 9.02083 11 8.55 11 8C11 7.45 10.8042 6.97917 10.4125 6.5875C10.0208 6.19583 9.55 6 9 6C8.45 6 7.97917 6.19583 7.5875 6.5875C7.19583 6.97917 7 7.45 7 8C7 8.55 7.19583 9.02083 7.5875 9.4125C7.97917 9.80417 8.45 10 9 10C9.55 10 10.0208 9.80417 10.4125 9.4125Z"
            fill="white"
        />
    </svg>
);

const LogoutIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10 21V19H5V5H10V3H5C4.45 3 3.97917 3.19583 3.5875 3.5875C3.19583 3.97917 3 4.45 3 5V19C3 19.55 3.19583 20.0208 3.5875 20.4125C3.97917 20.8042 4.45 21 5 21H10ZM14 17L12.625 15.55L15.175 13H7V11H15.175L12.625 8.45L14 7L19 12L14 17Z"
            fill="white"
        />
    </svg>
);

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const headerVisible = useUiStore((state) => state.headerVisible);
    const setHeaderVisible = useUiStore((state) => state.setHeaderVisible);
    const isEditorRoute = pathname?.startsWith("/mis-actividades/editorActividades");

    useEffect(() => {
        setHeaderVisible(!isEditorRoute);
    }, [isEditorRoute, setHeaderVisible]);

    if (!headerVisible || isEditorRoute) {
        return null;
    }

    const isAuthenticated = Boolean(user);

    const navLinks = isAuthenticated
        ? [
            { label: "Inicio", href: "/inicio" },
            { label: "Mis actividades", href: "/mis-actividades" },
            { label: "Plantillas", href: "/plantillas" },
            { label: "Guias", href: "/guias" },
            { label: "Ajustes", href: "/ajustes" },
        ]
        : [
            { label: "Inicio", href: "/" },
            { label: "Plantillas", href: "/plantillas" },
            { label: "Guias", href: "/guias" },
        ];

    const handleLogout = async () => {
        await logout();
        document.cookie = "eduguias-auth=; path=/; max-age=0; samesite=lax";
        router.push("/");
    };

    return (
        <header className="w-full bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-360 mx-auto px-6 lg:px-14 h-18.75 flex items-center justify-between gap-8">

                {/* Logo */}
                <Link href={isAuthenticated ? "/inicio" : "/"} className="flex items-center gap-2.5 shrink-0">
                    <LogoIcon />
                    <span className="font-lexend font-bold text-xl tracking-tight text-edu-dark">
                        EduGuias
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isActive = link.href === "/"
                            ? pathname === "/" || pathname === "/inicio"
                            : pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={
                                    isActive
                                        ? "font-lexend font-semibold text-sm text-brand underline underline-offset-2"
                                        : "font-lexend font-medium text-sm text-edu-muted hover:text-edu-dark transition-colors"
                                }
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* CTA */}
                <div className="flex items-center gap-3 shrink-0">
                    {isAuthenticated ? (
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 bg-brand text-white font-lexend font-bold text-sm px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                        >
                            <LogoutIcon />
                            <span>Cerrar sesion</span>
                        </button>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden sm:flex items-center gap-1.5 bg-brand text-white font-lexend font-bold text-sm px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                <LoginIcon />
                                <span>Iniciar sesión</span>
                            </Link>

                            <Link
                                href="/signup"
                                className="flex items-center gap-1.5 bg-brand text-white font-lexend font-bold text-sm px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
                            >
                                <RegisterIcon />
                                <span>Crear cuenta</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

