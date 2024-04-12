"use client";

import { Prisma } from "@prisma/client";
import { acceptAssign, applyForAssignee, assignSelf, assignTo, rejectAssign, removeApplyForAssignee } from "./actions";
import { useState } from "react";

type IssueWithIncludes = Prisma.IssueGetPayload<{ include: { author: true, assignee: true, status: true, project: true, candidates: true } }>;

export default function AssignCard({ issue, session }: { issue: IssueWithIncludes, session: { accountId: number; expires: Date; } }) {
  const isApplied = issue.candidates.some(account => account.id === session?.accountId);
  const isMeAuthor = issue.authorId === session.accountId;
  const isUnassigned = issue.assigneeId === null;
  const isNotAcceptedYet = issue.status.value === "대기" && issue.assigneeId === session.accountId;

  const [selectedCandidate, setSelectedCanditate] = useState<string | undefined>();

  return (
    <div className="card card-bordered card-compact">
      <div className="card-body">
        <span className="font-semibold">담당자 선정</span>
        <div className="card-actions items-center min-h-12">
          <span>후보 {issue.candidates.length}명</span>
          <div className="avatar-group -space-x-4 rtl:space-x-reverse">
            {issue.candidates.slice(0, 4).map(candi => {
              return (
                <div title={candi.name} className="avatar placeholder" key={candi.id}>
                  <div className="bg-neutral text-neutral-content rounded-full w-8">
                    <span className="text-xs">{candi.name.slice(0, 2)}</span>
                  </div>
                </div>
              )
            })}
            {issue.candidates.length > 4 ?
              <div className="avatar placeholder">
                <div className="w-8 bg-neutral text-neutral-content">
                  <span>+99</span>
                </div>
              </div>
              : null}
          </div>
          {isMeAuthor && isUnassigned &&
            <>
              {issue.candidates.length > 0 &&
                <>
                  <select name="candidates" className="select select-sm select-bordered" value={selectedCandidate} onChange={(e) => setSelectedCanditate(e.target.value)}>
                    {/* undefined를 넣으면 text가 value가 되어버림 따라서 공백 문자열을 넣어야 아래 disabled에 boolean으로 변환 가능 */}
                    <option value={""}>후보 중 선택</option>
                    {issue.candidates.map(candi => <option key={candi.id} value={candi.id}>{candi.name}</option>)}
                  </select>
                  <button className="btn btn-sm" disabled={!selectedCandidate} onClick={() => assignTo(issue.id, parseInt(selectedCandidate!))}>를(을) 담당자로 지정</button>
                </>}
              <button className="btn btn-sm" onClick={() => assignSelf(issue.id)}>또는 직접 담당</button>
            </>}
          {!isMeAuthor && !isNotAcceptedYet && <>
            {isApplied
              ? <button className="btn btn-sm" onClick={() => removeApplyForAssignee(issue.id)}>입찰 취소</button>
              : <button className="btn btn-sm" onClick={() => applyForAssignee(issue.id)}>입찰</button>}
          </>}
          {isNotAcceptedYet && <>
            <button className="btn btn-sm" onClick={() => acceptAssign(issue.id)}>담당 수락</button>
            <button className="btn btn-sm" onClick={() => rejectAssign(issue.id)}>담당 거절</button>
          </>}
        </div>
      </div>
    </div>
  )
}