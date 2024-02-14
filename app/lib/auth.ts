import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secretKey = "I know, this should be set elsewhere";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 min from now")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, { algorithms: ["HS256"] });
  return payload;
}

export async function createSession(accountId: number) {
  const expires = new Date(Date.now() + 10 * 60 * 1000);
  const session = await encrypt({ accountId, expires });

  cookies().set("rim_session", session, { expires, httpOnly: true });
}

export async function deleteSession() {
  cookies().delete("rim_session");
}

export async function getSession(): Promise<{ accountId: number; expires: Date; } | null> {
  const session = cookies().get("rim_session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

// 미들웨어에서 사용
export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("rim_session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 10 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: "rim_session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
