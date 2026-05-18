// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public routes (no auth needed)
  const publicRoutes = ["/", "/auth/login", "/auth/callback"];
  const isPublicRoute = publicRoutes.some((r) => pathname.startsWith(r));

  // If not logged in and trying to access protected route
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If logged in and going to login page, redirect to dashboard
  if (user && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If logged in but onboarding not done, redirect to onboarding
  if (user && !isPublicRoute && pathname !== "/onboarding") {
    const { data: profile } = await supabase
      .from("users")
      .select("onboarding_complete")
      .eq("id", user.id)
      .single();

    if (profile && !profile.onboarding_complete) {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
