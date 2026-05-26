import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareAuthClient } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";
  const response = NextResponse.redirect(new URL(next, request.url));

  if (code) {
    const supabase = createMiddlewareAuthClient(request, response);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
