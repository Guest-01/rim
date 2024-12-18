"use client"

import clsx from "clsx";
import { forwardRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ConfirmDlg = forwardRef<HTMLDialogElement, { title: string; content: string; onConfirm: Function; isDestructive?: boolean }>(({ title, content, onConfirm, isDestructive }, ref) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true) }, []);

  return mounted ? createPortal(
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">{title}</h3>
        <div className="py-4">{content}</div>
        <div className="modal-action">
          <form method="dialog" className="flex gap-2">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm">취소</button>
            <button className={clsx("btn btn-sm btn-primary", { "btn-error text-base-100": isDestructive })} onClick={() => onConfirm()}>{isDestructive ? "삭제" : "확인"}</button>
          </form>
        </div>
      </div>
    </dialog>,
    document.body
  ) : null;
})

// https://stackoverflow.com/questions/52992932/component-definition-is-missing-display-name-react-display-name
ConfirmDlg.displayName = "ConfirmDlg";

export default ConfirmDlg;