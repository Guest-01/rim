"use server";

import { getSession } from "@/app/lib/auth";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createIssue(prevState: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1000));

  for (let [k, v] of formData.entries()) {
    // formData에는 사용자가 입력한 input이 아닌 Next에서 삽입한 필드도 있기 때문에.
    if (k.startsWith("$") || k.startsWith("content")) continue;
    if (!v) return "빈 양식이 있습니다";
  }

  const session = await getSession();
  if (!session) return redirect("/login");

  const projectId = formData.get("project")?.toString() === "null" ? undefined : parseInt(formData.get("project")!.toString());
  const assigneeId = formData.get("assignee")?.toString() === "null" ? undefined : parseInt(formData.get("assignee")!.toString());
  let statusValue;
  if (assigneeId && assigneeId === session.accountId) {
    statusValue = "수락";
  } else if (assigneeId) {
    statusValue = "대기";
  } else {
    statusValue = "신규";
  }

  await prisma.issue.create({
    data: {
      ...(projectId && { project: { connect: { id: projectId } } }),
      ...(assigneeId && { assignee: { connect: { id: assigneeId } } }),
      title: formData.get("title")!.toString(),
      author: { connect: { id: session.accountId } },
      status: { connect: { value: statusValue } },
      content: formData.get("content")!.toString(),
    }
  })

  revalidatePath("/issues");
  redirect("/issues");
}
