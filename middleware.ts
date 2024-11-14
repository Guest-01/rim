import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "./app/lib/auth";

export const config = {
  matcher: [
    '/((?!login|signup|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export async function middleware(request: NextRequest) {
  try {
    // getSession에서 세션을 가져오고, 오류가 발생하면 "/login"으로 리디렉션
    const session = await getSession();
    if (!session) {
      console.log("No session found. Redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (err) {
    // @ts-expect-error
    if (err.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
      console.error("Signature verification failed:", err);

      // "rim_session" 쿠키 삭제
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("rim_session");
      return response;
    }
    console.error("Unhandled error:", err);
  }

  // 세션이 있으면 updateSession 호출 (오류 처리는 생략)
  return await updateSession(request);
}
