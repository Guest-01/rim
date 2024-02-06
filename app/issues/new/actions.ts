"use server";

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createIssue(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 3000));

  if (!formData.get("title") || !formData.get("content")) {
    return "빈 양식이 있습니다";
  }

  await prisma.issue.create({
    data: {
      title: formData.get("title")!.toString(),
      content: formData.get("content")!.toString(),
    },
  });

  revalidatePath("/issues");
  redirect("/issues");
}
