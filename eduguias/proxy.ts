import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/inicio", "/mis-actividades", "/ajustes"];
const authPrefixes = ["/login", "/signup"];

function matchesPrefix(pathname: string, prefixes: string[]) {
    return prefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
}

export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const isAuthenticated = request.cookies.get("eduguias-auth")?.value === "1";

    const isProtectedRoute = matchesPrefix(pathname, protectedPrefixes);
    const isAuthRoute = matchesPrefix(pathname, authPrefixes);

    if (!isAuthenticated && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && pathname === "/") {
        return NextResponse.redirect(new URL("/inicio", request.url));
    }

    if (isAuthenticated && isAuthRoute) {
        return NextResponse.redirect(new URL("/inicio", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};