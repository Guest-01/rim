"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

export async function signUp(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1000));

  for (let [k, v] of formData.entries()) {
    // formData에는 사용자가 입력한 input이 아닌 Next에서 삽입한 필드도 있기 때문에.
    if (k.startsWith("$")) continue;
    if (!v) return { error: "빈 양식이 있습니다" };
  }

  if (formData.get("password") !== formData.get("passwordConfirm")) {
    return { error: "비밀번호 확인이 일치하지 않습니다" };
  }

  try {
    await prisma.account.create({
      data: {
        role: { connect: { value: formData.get("role")?.toString().trim() } },
        email: formData.get("email")!.toString().trim(),
        name: formData.get("username")!.toString().trim(),
        password: await bcrypt.hash(formData.get("password")!.toString().trim(), 10),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: `${e.code} ${JSON.stringify(e.meta)}` };
    }
    console.error(e);
    return { error: "알 수 없는 DB 오류입니다" };
  }

  revalidatePath("/accounts");
  return { error: null };
}
