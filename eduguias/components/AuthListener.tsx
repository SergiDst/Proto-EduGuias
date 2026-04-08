"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthListener() {
    const initAuthListener = useAuthStore((state) => state.initAuthListener);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        const unsubscribe = initAuthListener();
        return unsubscribe;
    }, [initAuthListener]);

    useEffect(() => {
        if (user) {
            document.cookie = "eduguias-auth=1; path=/; max-age=2592000; samesite=lax";
            return;
        }

        document.cookie = "eduguias-auth=; path=/; max-age=0; samesite=lax";
    }, [user]);

    return null;
}
