import { Suspense } from "react";
import { LoginContent } from "./LoginContent";

export default function Login() {
    return (
        <Suspense fallback={<LoginLoadingFallback />}>
            <LoginContent />
        </Suspense>
    );
}

function LoginLoadingFallback() {
    return (
        <div className="flex min-h-screen bg-edu-bg font-lexend">
            <div className="flex-1 flex items-center justify-center px-8 py-16">
                <div className="w-full max-w-md flex flex-col gap-8">
                    <div className="h-12 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="flex flex-col gap-2">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}