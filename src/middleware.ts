import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  try {
    const { createMiddlewareClient } = await import("@supabase/auth-helpers-nextjs");
    const res = NextResponse.next();

    let session = null;
    try {
      const supabase = createMiddlewareClient({ req, res });
      const { data } = await supabase.auth.getSession();
      session = data.session;
    } catch (cookieError) {
      console.warn("⚠️ Cookie inválido detectado, limpando e prosseguindo...");
      // Remove cookie corrompido para evitar loop
      res.cookies.delete("sb-" + process.env.NEXT_PUBLIC_SUPABASE_URL);
    }

    console.log("🟢 Sessão no middleware:", session?.user?.email || "Nenhum usuário");

    const pathname = req.nextUrl.pathname;

    if (!session && pathname.startsWith("/condominios")) {
      const loginUrl = new URL("/", req.url);
      console.log("🔴 Redirecionando para login...");
      return NextResponse.redirect(loginUrl);
    }

    return res;
  } catch (err) {
    console.error("❌ Erro inesperado no middleware:", err);
    return NextResponse.next(); // Evita tela branca mesmo em erro
  }
}

export const config = {
  matcher: ["/condominios/:path*"],
};
