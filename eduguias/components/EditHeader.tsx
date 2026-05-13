import Link from "next/link";

interface EditHeaderProps {
    onMenuClick?: () => void;
    onAssistantClick?: () => void;
}

export default function EditHeader({ onMenuClick, onAssistantClick }: EditHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between px-4 sm:px-6 bg-white border-b border-slate-200 shrink-0 z-20 gap-2">
            {/* Mobile menu button */}
            {onMenuClick ? (
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Abrir menú de secciones"
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M4 6h16M4 12h16M4 18h16" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                </button>
            ) : null}

            {/* Logo */}
            <Link href="/inicio" className="flex items-center gap-2.5 mr-auto">
                <svg width="24" height="20" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M13.75 22.5L5 17.75V10.25L0 7.5L13.75 0L27.5 7.5V17.5H25V8.875L22.5 10.25V17.75L13.75 22.5ZM13.75 12.125L22.3125 7.5L13.75 2.875L5.1875 7.5L13.75 12.125ZM13.75 19.6562L20 16.2812V11.5625L13.75 15L7.5 11.5625V16.2812L13.75 19.6562Z" fill="#135BEC" />
                </svg>
                <span className="font-bold text-base sm:text-lg text-[#0F172A] tracking-[-0.5px] hidden xs:inline sm:inline">EduGuias</span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/mis-actividades"
                    className="hidden sm:inline-flex items-center font-[Lexend] text-sm font-medium text-[#0F172A] bg-white border border-slate-200 rounded-xl px-5 py-2.5 hover:border-slate-300 transition-colors"
                >
                    Volver a inicio
                </Link>
                <Link href="/mis-actividades"
                    className="sm:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    aria-label="Volver a inicio"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M15 18l-6-6 6-6" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Link>
                <button className="hidden sm:inline-flex font-[Lexend] text-sm font-bold text-white bg-[#135BEC] rounded-xl px-5 py-2.5 hover:bg-blue-700 transition-colors">
                    Probar actividad
                </button>

                {/* Mobile assistant trigger */}
                {onAssistantClick ? (
                    <button
                        type="button"
                        onClick={onAssistantClick}
                        className="lg:hidden p-2 -mr-1 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Abrir asistente"
                    >
                        <svg width="22" height="22" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                            <circle cx="9" cy="9" r="7.5" stroke="#135BEC" strokeWidth="1.6" />
                            <path d="M9 8.25V13.5" stroke="#135BEC" strokeWidth="1.6" strokeLinecap="round" />
                            <circle cx="9" cy="5.625" r="0.875" fill="#135BEC" />
                        </svg>
                    </button>
                ) : null}
            </div>
        </header>
    );
}
