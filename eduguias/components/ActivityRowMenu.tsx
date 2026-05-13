"use client";

import { useEffect, useRef, useState } from "react";
import { DotsIcon } from "@/components/InicioIcons";

interface ActivityRowMenuProps {
    onEdit?: () => void;
    onExport?: () => void;
    onDelete?: () => void;
}

interface MenuItem {
    label: string;
    onClick: () => void;
    isDanger?: boolean;
    icon: React.ReactNode;
}

export function ActivityRowMenu({ onEdit, onExport, onDelete }: ActivityRowMenuProps) {
    const [open, setOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const items: MenuItem[] = [];
    if (onEdit) items.push({ label: "Editar", onClick: onEdit, icon: <EditIcon /> });
    if (onExport) items.push({ label: "Exportar", onClick: onExport, icon: <ExportIcon /> });
    if (onDelete) items.push({ label: "Eliminar", onClick: onDelete, isDanger: true, icon: <TrashIcon /> });

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        if (open && menuRef.current) {
            menuRef.current.focus();
            setHighlightIndex(0);
        } else if (!open) {
            setHighlightIndex(-1);
        }
    }, [open]);

    const handleButtonKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
        } else if (event.key === "Escape" && open) {
            setOpen(false);
        }
    };

    const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightIndex((prev) => (prev + 1) % items.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightIndex((prev) => (prev - 1 + items.length) % items.length);
        } else if (event.key === "Home") {
            event.preventDefault();
            setHighlightIndex(0);
        } else if (event.key === "End") {
            event.preventDefault();
            setHighlightIndex(items.length - 1);
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (highlightIndex >= 0) {
                items[highlightIndex].onClick();
                setOpen(false);
                buttonRef.current?.focus();
            }
        } else if (event.key === "Escape" || event.key === "Tab") {
            setOpen(false);
            if (event.key === "Escape") {
                event.preventDefault();
                buttonRef.current?.focus();
            }
        }
    };

    return (
        <div ref={wrapperRef} className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                ref={buttonRef}
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                onKeyDown={handleButtonKeyDown}
                className="p-1.5 rounded hover:bg-edu-light transition-colors"
                aria-label="Más opciones"
                aria-haspopup="menu"
                aria-expanded={open}
            >
                <DotsIcon />
            </button>

            {open ? (
                <div
                    ref={menuRef}
                    role="menu"
                    aria-label="Acciones de actividad"
                    tabIndex={-1}
                    onKeyDown={handleMenuKeyDown}
                    className="absolute right-0 top-full mt-1 z-30 w-44 rounded-xl border border-[#E2E8F0] bg-white shadow-lg shadow-slate-900/10 overflow-hidden focus:outline-none"
                >
                    {items.map((item, idx) => {
                        const isHighlighted = idx === highlightIndex;
                        return (
                            <button
                                key={item.label}
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    item.onClick();
                                    setOpen(false);
                                    buttonRef.current?.focus();
                                }}
                                onMouseEnter={() => setHighlightIndex(idx)}
                                className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-lexend text-sm transition-colors text-left ${
                                    item.isDanger
                                        ? `text-[#EF4444] ${isHighlighted ? "bg-red-50" : "hover:bg-red-50"}`
                                        : `text-[#0F172A] ${isHighlighted ? "bg-[#F8FAFC]" : "hover:bg-[#F8FAFC]"}`
                                } ${idx > 0 && items[idx - 1].isDanger !== item.isDanger ? "border-t border-[#F1F5F9]" : ""}`}
                            >
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

function EditIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M11.333 2.667a1.886 1.886 0 0 1 2.667 2.666L5.333 14H2.667v-2.666l8.666-8.667Z"
                stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function ExportIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M8 10V2.667M8 2.667 5.333 5.333M8 2.667l2.667 2.666M2.667 12v.667c0 .736.597 1.333 1.333 1.333h8c.736 0 1.333-.597 1.333-1.333V12"
                stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
function TrashIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2.667 4h10.666M6.667 6.667v5.333M9.333 6.667v5.333M4 4l.667 8.667c0 .736.597 1.333 1.333 1.333h4c.736 0 1.333-.597 1.333-1.333L12 4M6 4V2.667c0-.737.597-1.334 1.333-1.334h1.334c.736 0 1.333.597 1.333 1.334V4"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}
