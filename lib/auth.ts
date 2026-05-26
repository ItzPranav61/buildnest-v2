import { createBrowserClient, createServerClient } from "@supabase/auth-helpers-nextjs";
import type { NextRequest, NextResponse } from "next/server";

export function getSupabaseAuthConfig() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return {
    supabaseUrl: rawUrl.replace(/\/rest\/v1\/?$/, ""),
    supabaseAnonKey: anonKey
  };
}

export function createBrowserAuthClient() {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseAuthConfig();
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function createMiddlewareAuthClient(request: NextRequest, response: NextResponse) {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseAuthConfig();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      }
    }
  });
}
