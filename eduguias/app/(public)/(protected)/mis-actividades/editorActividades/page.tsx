'use client'

import { useUiStore } from "@/stores/uiStore";
import { useEffect } from "react";

export default function EditPage({ TipoActividad }: { TipoActividad: string }) {

    const setHeaderVisible = useUiStore((state) => state.setHeaderVisible);

    useEffect(() => {
        setHeaderVisible(false);

        return () => {
            setHeaderVisible(true);
        }
    }, [setHeaderVisible]);


    switch (TipoActividad) {
        case "cuestionario":
            return <div>Editor de cuestionarios</div>;
        case "union de conceptos":
            return <div>Editor de union de conceptos</div>;
        case "lectura":
            return <div>Editor de lectura</div>;
        case "video guia":
            return <div>Editor de video guia</div>;
        case "verdadero falso":
            return <div>Editor de verdadero falso</div>;
        default:
            return <div>Tipo de actividad no reconocido</div>;
    }
}