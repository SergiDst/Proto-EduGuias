"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import EditHeader from "@/components/EditHeader";
import EditNavbar from "@/components/EditNavbar";
import EditSideBar from "@/components/EditSideBar";
import { MicrotipToastContainer } from "@/components/MicrotipToast";

export default function TipoActividadLayout({ children }: { children: React.ReactNode; }) {
    const [assistantOpen, setAssistantOpen] = useState(false); // start closed on mobile
    const [navOpen, setNavOpen] = useState(false);            // mobile nav drawer
    const [isDesktop, setIsDesktop] = useState(false);
    const params = useParams<{ tipoActividad: string; seccion?: string }>();
    const tipoActividad = params?.tipoActividad ?? "";
    const seccionActual = params?.seccion;
    const paletteMode = seccionActual === "paleta";

    // Detect breakpoint and react to resize
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 1024px)");
        const update = () => {
            setIsDesktop(mq.matches);
            if (mq.matches) {
                // open assistant by default on desktop
                setAssistantOpen(true);
                setNavOpen(false);
            } else {
                setAssistantOpen(false);
            }
        };
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    // Body scroll lock when mobile drawers open
    useEffect(() => {
        if (!isDesktop && (navOpen || assistantOpen)) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => { document.body.style.overflow = prev; };
        }
    }, [isDesktop, navOpen, assistantOpen]);

    // Esc closes drawers on mobile
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape" && !isDesktop) {
                setNavOpen(false);
                setAssistantOpen(false);
            }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [isDesktop]);

    const sidebarMarginClass = isDesktop
        ? assistantOpen
            ? (paletteMode ? "lg:mr-88" : "lg:mr-70")
            : "lg:mr-12"
        : "";
    const navMarginClass = isDesktop ? "lg:ml-55" : "";

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#F6F6F8]">
            <a href="#editor-content" className="skip-to-content">
                Saltar al contenido
            </a>

            <EditHeader
                onMenuClick={() => setNavOpen(true)}
                onAssistantClick={() => setAssistantOpen(true)}
            />

            <div className="relative flex flex-1 min-h-0 overflow-hidden">
                {/* Mobile backdrop */}
                {!isDesktop && (navOpen || assistantOpen) ? (
                    <button
                        type="button"
                        aria-label="Cerrar paneles"
                        onClick={() => {
                            setNavOpen(false);
                            setAssistantOpen(false);
                        }}
                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    />
                ) : null}

                <EditNavbar
                    progress={0}
                    tipoActividad={tipoActividad}
                    seccionActual={seccionActual}
                    isMobileOpen={navOpen}
                    onMobileClose={() => setNavOpen(false)}
                    isDesktop={isDesktop}
                />

                <main
                    id="editor-content"
                    className={`flex-1 min-w-0 overflow-y-auto ${sidebarMarginClass} ${navMarginClass}`}
                >
                    <div className="h-full min-h-full">{children}</div>
                </main>

                <EditSideBar
                    assistantOpen={assistantOpen}
                    setAssistantOpen={setAssistantOpen}
                    seccionActual={seccionActual}
                    isDesktop={isDesktop}
                />
            </div>

            <MicrotipToastContainer />
        </div>
    );
}
