"use server"

import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProject(projectId: number) {
  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath("/admin/projects");
}
