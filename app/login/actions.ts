"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function login(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1000));

  for (let [k, v] of formData.entries()) {
    // formData에는 사용자가 입력한 input이 아닌 Next에서 삽입한 필드도 있기 때문에.
    if (k.startsWith("$")) continue;
    if (!v) return "빈 양식이 있습니다"
  }

  const account = await prisma.account.findFirst({ where: { email: { equals: formData.get("email")?.toString().trim() } } });
  if (!account) return "가입되지 않은 이메일입니다"

  const isCorrectPw = await bcrypt.compare(formData.get("password")!.toString().trim(), account.password);
  if (!isCorrectPw) return "비밀번호가 올바르지 않습니다"

  return "no errors"

  revalidatePath("/accounts");
  redirect("/login");
}
