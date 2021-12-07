// pages/_middleware.ts

import { NextRequest, NextResponse } from "next/server";
import parser from "accept-language-parser";

export function middleware(request: NextRequest) {
  const { locale, href } = request.nextUrl;

  if (locale === "default" && !href.includes("/api/")) {
    const lang =
      parser.pick(
        ["id", "en"],
        request.headers.get("accept-language") ?? "en;q=1.0"
      ) ?? "en";

    return NextResponse.redirect(`/${lang}${href}`);
  }

  return undefined;
}
