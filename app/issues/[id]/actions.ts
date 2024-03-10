"use server"

import { getSession } from "@/app/lib/auth"
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function assignSelf(issueId: number) {
  const session = await getSession();
  if (!session) return redirect("/login");
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      assignee: { connect: { id: session.accountId } }
    }
  });
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}

export async function assignTo(issueId: number, accountId: number) {
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      assignee: { connect: { id: accountId } }
    }
  })
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}

export async function applyForAssignee(issueId: number) {
  const session = await getSession();
  if (!session) return redirect("/login");
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      candidates: { connect: { id: session.accountId } }
    }
  })
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}

export async function removeApplyForAssignee(issueId: number) {
  const session = await getSession();
  if (!session) return redirect("/login");
  await prisma.issue.update({
    where: { id: issueId },
    data: {
      candidates: { disconnect: { id: session.accountId } }
    }
  })
  revalidatePath("/issues");
  revalidatePath(`/issues/${issueId}`);
}