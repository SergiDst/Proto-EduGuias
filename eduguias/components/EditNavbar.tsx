const navItems = [
    {
        id: "objetivo",
        label: "Objetivo",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="9" cy="9" r="1.5" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: "contenido",
        label: "Contenido",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 4.5H15M3 9H15M3 13.5H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "retroalimentacion",
        label: "Retroalimentación",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="3" width="15" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.25 16.5H12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M9 13.5V16.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
    },
    {
        id: "paleta",
        label: "Paleta de colores",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9C1.5 13.14 4.86 16.5 9 16.5C9.83 16.5 10.5 15.83 10.5 15C10.5 14.61 10.35 14.265 10.11 14.01C9.87 13.755 9.735 13.41 9.735 13.05C9.735 12.225 10.41 11.55 11.235 11.55H12.75C14.82 11.55 16.5 9.87 16.5 7.8C16.5 4.335 13.14 1.5 9 1.5Z" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="5.25" cy="9" r="1.125" fill="currentColor" />
                <circle cx="7.5" cy="5.25" r="1.125" fill="currentColor" />
                <circle cx="11.25" cy="5.25" r="1.125" fill="currentColor" />
            </svg>
        ),
    },
    {
        id: "evaluacion",
        label: "Evaluación",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="1.5" y="1.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M5.25 9H12.75M5.25 6H12.75M5.25 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        id: "descargar",
        label: "Descargar",
        icon: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2.25V12M9 12L5.25 8.25M9 12L12.75 8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.25 13.5V15C2.25 15.414 2.586 15.75 3 15.75H15C15.414 15.75 15.75 15.414 15.75 15V13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
    },
];

export default function EditNavbar({ progress, activeNav, setActiveNav }: { progress: number; activeNav: string; setActiveNav: (nav: string) => void }) {
    return (
        <aside className="w-55 shrink-0 bg-white border-r border-slate-200 flex flex-col">
            {/* Type label */}
            <div className="px-5 pt-6 pb-4 border-b border-slate-100">
                <p className="font-[Lexend] text-[11px] font-bold text-[#0F172A] tracking-[0.5px] uppercase">
                    Cuestionario
                </p>
                <p className="font-[Lexend] text-xs text-[#475569] mt-0.5">Editor guiado</p>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {navItems.map((item) => {
                    const active = activeNav === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${active
                                ? "bg-blue-50 text-[#135BEC]"
                                : "text-[#475569] hover:bg-slate-50 hover:text-[#0F172A]"
                                }`}
                        >
                            <span className={active ? "text-[#135BEC]" : "text-[#94A3B8]"}>
                                {item.icon}
                            </span>
                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Progress */}
            <div className="px-5 py-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-[Lexend] text-xs text-[#475569]">Progreso</span>
                    <span className="font-[Lexend] text-xs font-bold text-[#0F172A]">{progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#135BEC] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </aside>
    )
}