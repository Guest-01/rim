"use server"

import { getSession } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function assignTo(issueId: number, accountId: number) {
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      assignee: { connect: { id: accountId } },
      status: { connect: { value: "대기" } }
    }
  });
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}

export async function addComment(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) return redirect("/login");

  try {
    await prisma.comment.create({
      data: {
        accountId: session.accountId,
        issueId: parseInt(formData.get("issue-id")!.toString()),
        content: formData.get("content")?.toString() ?? "",
      }
    })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: `${e.code} ${JSON.stringify(e.meta)}` };
    }
    console.error(e);
    return { error: "알 수 없는 DB 오류입니다" };
  }

  revalidatePath(`/issues/${parseInt(formData.get("issue-id")!.toString())}`)
  return { error: null };
}

export async function deleteComment(commentId: number) {
  const session = await getSession();
  if (!session) return redirect("/login");
  const parentIssueId = (await prisma.comment.findUniqueOrThrow({ where: { id: commentId } })).issueId
  await prisma.comment.delete({ where: { id: commentId } });
  revalidatePath(`/issues/${parentIssueId}`);
}

export async function rejectAssign(issueId: number) {
  const { authorId } = await prisma.issue.findUniqueOrThrow({ where: { id: issueId }, select: { authorId: true } });
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      assignee: { connect: { id: authorId! } },
      status: { connect: { value: "대기" } },
    },
  })
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}

export async function acceptAssign(issueId: number) {
  await prisma.issue.update({
    where: { id: issueId },
    data: { status: { connect: { value: "수락" } } },
  })
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}