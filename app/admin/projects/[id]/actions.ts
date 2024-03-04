"use server"

import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function editProject(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1000));

  for (let [k, v] of formData.entries()) {
    // formData에는 사용자가 입력한 input이 아닌 Next에서 삽입한 필드도 있기 때문에.
    if (k.startsWith("$") || k === "subtitle" || k === "members") continue;
    if (!v) return { error: "빈 양식이 있습니다" };
  }

  try {
    await prisma.project.update({
      where: { id: parseInt(formData.get("id") as string) },
      data: {
        title: formData.get("title")?.toString().trim(),
        subtitle: formData.get("subtitle")?.toString().trim(),
        members: {
          connect: formData.get("members")?.toString() === "" ? undefined : formData.get("members")?.toString().split(",").map(str => ({ id: parseInt(str) })),
          set: formData.get("members")?.toString() === "" ? [] : undefined
        },
      }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: `${e.code} ${JSON.stringify(e.meta)}` }
    }
    console.error(e);
    return { error: "알 수 없는 DB 오류입니다" }
  }

  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  return { error: null }
}