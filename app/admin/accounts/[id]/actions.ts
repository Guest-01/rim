"use server";

import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

export async function editAccount(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1000));

  for (let [k, v] of formData.entries()) {
    // formData에는 사용자가 입력한 input이 아닌 Next에서 삽입한 필드도 있기 때문에.
    if (k.startsWith("$") || k === "description") continue;
    if (!v) return { error: "빈 양식이 있습니다" };
  }

  try {
    await prisma.account.update({
      where: { id: parseInt(formData.get("id") as string) },
      data: {
        role: { connect: { value: formData.get("role")?.toString().trim() } },
        name: formData.get("username")!.toString().trim(),
        active: formData.get("active")?.toString() === "on",
        description: formData.get("description")?.toString().trim(),
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: `${e.code} ${JSON.stringify(e.meta)}` };
    }
    console.error(e);
    return { error: "알 수 없는 DB 오류입니다" };
  }

  revalidatePath("/admin/accounts");
  return { error: null };
}

export async function resetPassword(accountId: number, newPassword: string) {
  await prisma.account.update({
    where: { id: accountId },
    data: { password: await bcrypt.hash(newPassword, 10) },
  });
  revalidatePath("/admin/accounts");
  return { error: null };
}