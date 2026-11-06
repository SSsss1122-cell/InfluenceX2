import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ROLE_HOME, ROLE_PREFIXES, type Role } from "@/lib/auth/roles";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Fetch role from DB (never trust URL/query)
  let role: Role | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = (data?.role as Role) ?? null;
  }

  const protectedPrefixes = Object.values(ROLE_PREFIXES);
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  // 1. Not logged in → trying to access a dashboard
  if (isProtected && !user) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));
  }

  // 2. Logged in → wrong role dashboard → kick to their own dashboard
  if (isProtected && user && role) {
    const ownPrefix = ROLE_PREFIXES[role];
    if (!pathname.startsWith(ownPrefix)) {
      return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
    }
  }

  // 3. Logged in → visiting /login or /register → redirect home
  if (user && role && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};