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

    return (
        <div className="min-h-screen bg-[#F6F6F8] flex flex-col">
            <EditHeader />

            <div className="flex flex-1 min-h-0">
                <EditNavbar progress={0} tipoActividad={tipoActividad} seccionActual={seccionActual} />

                <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>

                <EditSideBar
                    assistantOpen={assistantOpen}
                    setAssistantOpen={setAssistantOpen}
                />
            </div>
        </div>
    );
}