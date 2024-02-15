"use client"

import { Ref, useRef } from "react";

export default function ConfirmDlg() {
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Press ESC key or click on ✕ button to close</p>
      </div>
    </dialog>
  )
}