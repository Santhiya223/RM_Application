import { NextResponse } from "next/server";

export function middleware (request) {
    const {pathname} = request.nextUrl;
    const isAuthorized = request.cookies.get('accessToken')?.value;

    if(!isAuthorized) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    } else {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/"]
}