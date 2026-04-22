"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import EditHeader from "@/components/EditHeader";
import EditNavbar from "@/components/EditNavbar";
import EditSideBar from "@/components/EditSideBar";

export default function TipoActividadLayout({ children }: { children: React.ReactNode; }) {
    const [assistantOpen, setAssistantOpen] = useState(true);
    const params = useParams<{ tipoActividad: string; seccion?: string }>();
    const tipoActividad = params?.tipoActividad ?? "";
    const seccionActual = params?.seccion;
    const paletteMode = seccionActual === "paleta";
    const sidebarMarginClass = assistantOpen ? (paletteMode ? "mr-88" : "mr-70") : "mr-12";

    return (
        <div className="flex h-screen flex-col overflow-hidden bg-[#F6F6F8]">
            <EditHeader />

            <div className="relative flex flex-1 min-h-0 overflow-hidden">
                <EditNavbar progress={0} tipoActividad={tipoActividad} seccionActual={seccionActual} />

                <main className={`flex-1 min-w-0 overflow-y-auto ${sidebarMarginClass} ml-55`}>
                    <div className="h-full min-h-full">{children}</div>
                </main>

                <EditSideBar
                    assistantOpen={assistantOpen}
                    setAssistantOpen={setAssistantOpen}
                    seccionActual={seccionActual}
                />
            </div>
        </div>
    );
}