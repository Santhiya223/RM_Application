import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value || // For HTTP
    request.cookies.get("__Secure-next-auth.session-token")?.value; // For HTTPS

  console.log("Session token:", sessionToken);
  console.log("Pathname:", pathname);

  if (!sessionToken && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (sessionToken && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
