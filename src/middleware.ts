import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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

  const pathname = request.nextUrl.pathname;

  async function checkAdminRole(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", userId)
      .single();
    return !!data;
  }

  // API routes: /api/admin/*
  if (pathname.startsWith("/api/admin")) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!(await checkAdminRole(user.id))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return supabaseResponse;
  }

  // Page routes: /admin/*
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      if (user) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return supabaseResponse;
    }

    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin role check
    if (!(await checkAdminRole(user.id))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
