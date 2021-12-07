// pages/_middleware.ts

import { NextRequest, NextResponse } from "next/server";
import parser from "accept-language-parser";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { locale, href, pathname } = request.nextUrl;

  if (
    locale === "default" &&
    !href.includes("/api/") &&
    !PUBLIC_FILE.test(pathname)
  ) {
    const lang =
      parser.pick(
        ["id", "en"],
        request.headers.get("accept-language") ?? "en;q=1.0"
      ) ?? "en";

    return NextResponse.redirect(`/${lang}${href}`);
  }

  return undefined;
}
