"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { ShieldIcon, PdfIcon, ExternalLinkIcon, DocIcon } from "@/components/GuiasIcons";
import { ResourceCard, ResourceCardProps } from "@/components/ResourceCard";
import { useGuiasStore } from "@/stores/guiasStore";

export default function Guias() {
  const { guias, loading, error, fetched, fetchGuias } = useGuiasStore((state) => ({
    guias: state.guias,
    loading: state.loading,
    error: state.error,
    fetched: state.fetched,
    fetchGuias: state.fetchGuias,
  }));

  useEffect(() => {
    fetchGuias().catch(() => undefined);
  }, [fetchGuias]);

  const plataformaDestacada = useMemo(
    () => guias.find((guia) => guia.tipo === "plataforma"),
    [guias]
  );

  const resources = useMemo<ResourceCardProps[]>(
    () =>
      guias
        .filter((guia) => guia.tipo === "recurso-oficial")
        .map((guia, index) => ({
          id: index + 1,
          icon:
            guia.action === "download" ? (
              index % 2 === 0 ? (
                <PdfIcon />
              ) : (
                <DocIcon />
              )
            ) : (
              <ExternalLinkIcon />
            ),
          iconBg:
            guia.action === "download"
              ? index % 2 === 0
                ? "bg-red-50"
                : "bg-emerald-50"
              : "bg-blue-50",
          meta: guia.meta ?? (guia.action === "download" ? "Descarga" : "Enlace externo"),
          title: guia.title,
          description: guia.description,
          action: guia.action,
          actionLabel: guia.action === "download" ? "Descargar" : "Abrir referencia",
          href: guia.url,
        })),
    [guias]
  );

  return (
    <div className="min-h-screen bg-edu-bg font-lexend">
      <main className="max-w-300 mx-auto px-6 lg:px-10 py-10 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-lexend font-extrabold text-4xl text-edu-dark">Guias</h1>
          <p className="font-lexend font-normal text-base text-edu-muted max-w-2xl">
            Explora recursos y guias creadas para mejorar la educación inclusiva.
          </p>
        </div>

        {plataformaDestacada ? (
          <div className="relative bg-brand rounded-2xl overflow-hidden px-10 py-12 flex items-center justify-between gap-8 min-h-70">
            <div className="flex flex-col gap-5 max-w-130 z-10">
              <span className="inline-flex self-start items-center px-3 py-1 rounded-full bg-white/20 font-lexend font-semibold text-xs tracking-widest text-white uppercase">
                Guia destacada
              </span>

              <h2 className="font-lexend font-extrabold text-3xl lg:text-4xl text-white leading-tight">
                {plataformaDestacada.title}
              </h2>

              <p className="font-lexend font-normal text-base text-white/85 leading-relaxed">
                {plataformaDestacada.description}
              </p>

              <Link
                href={plataformaDestacada.url}
                className="self-start flex items-center gap-2 bg-white text-brand font-lexend font-bold text-sm px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Leer guia
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center shrink-0 opacity-40">
              <ShieldIcon />
            </div>
          </div>
        ) : null}

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="font-lexend font-extrabold text-2xl text-edu-dark">Recursos oficiales</h2>
          </div>

          {loading ? (
            <div className="bg-white border border-edu-light rounded-2xl p-6 text-edu-muted">
              Cargando guias y recursos...
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">{error}</div>
          ) : null}

          {fetched && !loading && !error ? (
            resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-edu-light rounded-2xl p-6 text-edu-muted">
                No hay recursos oficiales disponibles.
              </div>
            )
          ) : null}
        </section>
      </main>
    </div>
  );
}
