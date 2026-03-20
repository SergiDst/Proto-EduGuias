"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export default function AuthListener() {
    const initAuthListener = useAuthStore((state) => state.initAuthListener);

    useEffect(() => {
        const unsubscribe = initAuthListener();
        return unsubscribe;
    }, [initAuthListener]);

    return null;
}
