import Link from "next/link";

export default function EditHeader() {
    return (
        <header className="flex h-16 items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0 z-20">
            {/* Logo */}
            <Link href="/inicio" className="flex items-center gap-2.5">
                <svg width="24" height="20" viewBox="0 0 28 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.75 22.5L5 17.75V10.25L0 7.5L13.75 0L27.5 7.5V17.5H25V8.875L22.5 10.25V17.75L13.75 22.5ZM13.75 12.125L22.3125 7.5L13.75 2.875L5.1875 7.5L13.75 12.125ZM13.75 19.6562L20 16.2812V11.5625L13.75 15L7.5 11.5625V16.2812L13.75 19.6562Z" fill="#135BEC" />
                </svg>
                <span className="font-bold text-lg text-[#0F172A] tracking-[-0.5px]">EduGuias</span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-3">
                <Link href="/mis-actividades"
                    className="font-[Lexend] text-sm font-medium text-[#0F172A] bg-white border border-slate-200 rounded-xl px-5 py-2.5 hover:border-slate-300 transition-colors"
                >
                    Volver a inicio
                </Link>
                <button className="font-[Lexend] text-sm font-bold text-white bg-[#135BEC] rounded-xl px-5 py-2.5 hover:bg-blue-700 transition-colors">
                    Probar actividad
                </button>
            </div>
        </header>
    )
}