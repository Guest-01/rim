"use client";

import { Prisma } from "@prisma/client";

type IssueWithIncludes = Prisma.IssueGetPayload<{ include: { author: true, assignee: true, status: true, project: true } }>;

export default function AssignCard({ issue, session }: { issue: IssueWithIncludes, session: { accountId: number; expires: Date; } }) {
  return (
    <div className="card card-bordered card-compact">
      <div className="card-body">
        <span className="font-semibold">담당자 선정 및 수락</span>
        {/* TODO */}
      </div>
    </div>
  )
}