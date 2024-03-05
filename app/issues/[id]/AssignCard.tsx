"use client";

import { Prisma } from "@prisma/client";
import { applyForAssignee, assignSelf, removeApplyForAssignee } from "./actions";

type IssueWithIncludes = Prisma.IssueGetPayload<{ include: { author: true, assignee: true, status: true, project: true, candidates: true } }>;

export default function AssignCard({ issue, session }: { issue: IssueWithIncludes, session: { accountId: number; expires: Date; } }) {
  const isApplied = issue.candidates.some(account => account.id === session?.accountId);
  const isMyIssue = issue.authorId === session.accountId;
  const isUnassigned = issue.assigneeId === null;
  const isNotAcceptedYet = issue.status.value === "대기" && issue.assigneeId === session.accountId;

  return (
    <div className="card card-bordered card-compact">
      <div className="card-body">
        <span>담당자 선정</span>
        <div className="card-actions items-center">
          <span>후보 #명</span>
          <div className="avatar-group -space-x-4 rtl:space-x-reverse">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">AB</span>
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">CD</span>
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-8">
                <span className="text-xs">EF</span>
              </div>
            </div>
            <div className="avatar placeholder">
              <div className="w-8 bg-neutral text-neutral-content">
                <span>+99</span>
              </div>
            </div>
          </div>
          {isMyIssue && isUnassigned && <button className="btn btn-sm" onClick={() => assignSelf(issue.id)}>직접 담당</button>}
          {!isMyIssue && <>
            {isApplied
              ? <button className="btn btn-sm" onClick={() => removeApplyForAssignee(issue.id)}>입찰 취소</button>
              : <button className="btn btn-sm" onClick={() => applyForAssignee(issue.id)}>입찰</button>}
          </>}
          {isNotAcceptedYet && <>
            <button className="btn btn-sm">담당 수락</button>
            <button className="btn btn-sm">담당 거절</button>
          </>}
        </div>
      </div>
    </div>
  )
}