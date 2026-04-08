"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const user = useAuthStore((state) => state.user);
    const authReady = useAuthStore((state) => state.authReady);

    useEffect(() => {
        if (!authReady) return;

        if (!user) {
            const nextPath = encodeURIComponent(pathname || "/inicio");
            router.replace(`/login?next=${nextPath}`);
        }
    }, [authReady, user, pathname, router]);

    if (!authReady) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center font-lexend text-edu-muted">
                Verificando sesion...
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
