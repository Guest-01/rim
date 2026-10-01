import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";

// 쿠키(세션)에 따라 결과가 달라지므로 캐시하지 않음
export const dynamic = "force-dynamic";

// 사이드바 배지 polling용. 미들웨어의 세션 갱신 대상에서 제외되어 있어서 (middleware.ts 참고)
// 여기서 직접 세션을 확인함. 만료/위조된 토큰이면 getSession이 예외를 던지므로 null로 처리.
export async function GET() {
  const session = await getSession().catch(() => null);
  if (!session) {
    return NextResponse.json({ count: 0 }, { status: 401 });
  }

  // 조건은 대기 일감 페이지 및 layout의 초기값과 동일하게 유지
  const count = await prisma.issue.count({
    where: { assigneeId: session.accountId, status: { value: "대기" } },
  });
  return NextResponse.json({ count });
}
