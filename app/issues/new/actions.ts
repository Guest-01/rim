"use server";

import { getSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createIssue(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1000));

  for (let [k, v] of formData.entries()) {
    console.log(k, v);
    // formData에는 사용자가 입력한 input이 아닌 Next에서 삽입한 필드도 있기 때문에.
    if (k.startsWith("$") || k.startsWith("content")) continue;
    if (!v) return "빈 양식이 있습니다";
  }

  const session = await getSession();
  if (!session) return redirect("/login");

  await prisma.issue.create({
    data: {
      projectId: parseInt(formData.get("project")!.toString()),
      title: formData.get("title")!.toString().trim(),
      issueStatusId: parseInt(formData.get("status")!.toString()),
      authorId: session.accountId,
      assigneeId: parseInt(formData.get("assignee")!.toString()),
      content: formData.get("content")!.toString().trim(),
    },
  });

  revalidatePath("/issues");
  redirect("/issues");
}
