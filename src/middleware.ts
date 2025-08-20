import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { allPages } from "contentlayer/generated";

// This middleware is used to rewrite the pathname to the SSR path during runtime as middleware is not ran during build
export function middleware(request: NextRequest) {
  const page = allPages.find(p => p.url === request.nextUrl.pathname);

  if (!page) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/dynamic" + url.pathname;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: "/:path*",
};
