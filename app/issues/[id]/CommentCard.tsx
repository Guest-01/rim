"use client";

import { Prisma } from "@prisma/client";
import { addComment, deleteComment } from "./actions";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";

type CommentWithIncludes = Prisma.CommentGetPayload<{ include: { author: true } }>;

export default function CommentCard({ comments, session }: { comments: CommentWithIncludes[]; session: { accountId: number; expires: Date; } }) {
  const params = useParams();
  const [state, formAction] = useFormState(addComment, null);
  const form = useRef<HTMLFormElement>(null);

  // 성공한 경우에는 form을 리셋. 에러가 발생하면 입력값 유지.
  useEffect(() => {
    if (state?.error) return;
    form.current?.reset();
  }, [state])

  return (
    <>
      <div className="card card-bordered card-compact">
        <div className="card-body">
          <span className="font-semibold">댓글</span>
          {comments.map(comment =>
            <div className="flex justify-between group" key={comment.id}>
              <div className="flex items-center gap-2 my-1">
                <div title={comment.author.name} className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-8">
                    <span className="text-xs">{comment.author.name.slice(0, 2)}</span>
                  </div>
                </div>
                <div>
                  {comment.content}
                  <span className="hidden ml-4 text-gray-400 group-hover:inline">{comment.author.name}</span>
                  <span className="hidden ml-2 text-gray-400 group-hover:inline">{comment.updatedAt.toLocaleString("ko")}</span>
                </div>
              </div>
              <div>
                {session?.accountId === comment.accountId
                  ? <span className="btn btn-xs btn-circle btn-ghost text-error" onClick={() => deleteComment(comment.id)}>✕</span>
                  : null
                }
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="my-2"></div>
      <div className="card card-bordered card-compact">
        <div className="card-body">
          <form ref={form} action={formAction} className="form-control">
            <input type="hidden" name="issue-id" value={params.id} />
            <textarea name="content" className="textarea textarea-sm textarea-bordered" placeholder="댓글 입력" />
            <button type="submit" className="btn btn-sm mt-2">댓글 등록</button>
          </form>
        </div>
      </div>
    </>
  )
}