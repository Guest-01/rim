"use client";

import { Account, Prisma } from "@prisma/client";
import { acceptAssign, assignTo, rejectAssign } from "./actions";
import { useState } from "react";

type IssueWithIncludes = Prisma.IssueGetPayload<{ include: { author: true, assignee: true, status: true, project: true } }>;

export default function AssignCard({ issue, session, accounts }: { issue: IssueWithIncludes, session: { accountId: number; expires: Date; }, accounts: Account[] }) {
  const notAcceptedYet = issue.status.value === "대기" && issue.assigneeId === session.accountId;
  const [selectedAssignee, setSelectedAssignee] = useState<string>();

  return (
    <div className="card card-bordered card-compact">
      <div className="card-body">
        <span className="font-semibold">담당자 지정</span>
        <div className="flex gap-2 items-center">
          {notAcceptedYet && <>
            <button className="btn btn-sm btn-success text-base-100" onClick={() => acceptAssign(issue.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
              수락
            </button>
            <span className="tooltip" data-tip="거절 시 담당자가 작성자로 돌아갑니다">
              <button className="btn btn-sm btn-error text-base-100" onClick={() => rejectAssign(issue.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                  <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
                </svg>
                거절
              </button>
            </span>
            <span>또는</span>
          </>}
          <span>담당자를</span>
          <select name="assignee" className="select select-bordered select-sm" value={selectedAssignee} onChange={(e) => setSelectedAssignee(e.target.value)}>
            {accounts.map(account => (
              <option key={account.id} value={account.id}>{account.name}</option>
            ))}
          </select>
          <span className="tooltip" data-tip="담당자를 변경하면 대기 상태로 돌아갑니다">
            <button className="btn btn-sm" onClick={() => assignTo(issue.id, parseInt(selectedAssignee!))}>로/으로 변경하기</button>
          </span>
        </div>
      </div>
    </div>
  )
}