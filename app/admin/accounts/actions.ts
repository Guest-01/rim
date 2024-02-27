"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../lib/prisma";

export async function activate(accountId: number) {
  await prisma.account.update({
    where: { id: accountId, },
    data: { active: true }
  });

  revalidatePath("/admin/accounts");
}

export async function deleteAccount(accountId: number) {
  await prisma.account.delete({ where: { id: accountId } });

  revalidatePath("/admin/accounts");
}
