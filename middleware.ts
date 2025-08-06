// middleware.ts (di root project)
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes yang memerlukan autentikasi
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const authRoutes = ["/login", "/register"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Jika user tidak login tapi mengakses protected route
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Jika user sudah login tapi mengakses auth route
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.searchParams.get("redirect");
    return NextResponse.redirect(new URL(redirectUrl || "/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
