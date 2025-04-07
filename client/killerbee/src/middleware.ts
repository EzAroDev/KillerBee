// src/middleware.ts
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/unauthorized", "/assets/bee.svg"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decoded: any = jwtDecode(token);
    const userRole = decoded.role;

    const routeRoles: Record<string, string[]> = {
      // "/home": ["USER", "ADMIN", "RD", "TEST", "PROD"],
      "/formulaire-test-procede": ["TEST", "ADMIN"],
      "/formulaire-prod-procede": ["PROD", "ADMIN"],
      "/formulaire-procede": ["RD", "ADMIN"],
      "/formulaire-model": ["RD", "ADMIN"],
      "/formulaire-ingredient": ["RD", "ADMIN"],
    };

    for (const [prefix, allowed] of Object.entries(routeRoles)) {
      if (pathname.startsWith(prefix) && !allowed.includes(userRole)) {
        const unauthorizedUrl = request.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
      }
    }

    return NextResponse.next();
  } catch (err) {
    // console.error("❌ Erreur lors du décodage du token :", err);
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
