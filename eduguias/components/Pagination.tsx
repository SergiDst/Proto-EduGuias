"use client";

import { useState } from "react";

export function Pagination() {
  const pages = [1, 2, 3, "...", 5];
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <nav aria-label="Paginación de actividades">
      <ul className="flex items-center gap-1">
        <li>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-edu-light bg-white text-edu-muted hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors"
            aria-label="Página anterior"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 19l-7-7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
        {pages.map((p, i) =>
          p === "..." ? (
            <li
              key={i}
              aria-hidden="true"
              className="w-8 h-8 flex items-center justify-center font-lexend text-sm text-edu-muted"
            >
              …
            </li>
          ) : (
            <li key={i}>
              <button
                className={`w-8 h-8 flex items-center justify-center rounded-lg font-lexend font-semibold text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  p === currentPage
                    ? "bg-brand text-white"
                    : "border border-edu-light bg-white text-edu-muted hover:border-brand/40"
                }`}
                aria-label={`Ir a página ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
                onClick={() => setCurrentPage(p as number)}
              >
                {p}
              </button>
            </li>
          )
        )}
        <li>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-edu-light bg-white text-edu-muted hover:border-brand/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand transition-colors"
            aria-label="Página siguiente"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="m9 5 7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}
