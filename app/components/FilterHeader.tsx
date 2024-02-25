"use client"
import clsx from "clsx";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FilterHeaderProps = {
  presets: { href: string; title: string; }[],
  selectOptions: { title: string; value: string; }[],
}

export default function FilterHeader({ presets, selectOptions }: FilterHeaderProps) {
  const searchParams = useSearchParams();
  // 필터가 활성화 상태인지 확인하는 함수, 이를 이용해 필터버튼의 색깔을 칠해준다.
  // searchParams.toString()이 빈값이면 무조건 true가 되어버리기 때문에 먼저 확인 후 && 컨디션 체이닝.
  const isCurrent = (href: string) => searchParams.toString() && href.includes(searchParams.toString());
  return (
    <div className="p-4 flex justify-between">
      <div className="flex gap-2 items-center">
        <span className="label label-text">필터</span>
        {searchParams.toString() && <Link href="?" className="btn btn-xs btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
          </svg>
        </Link>}
        {presets.map(preset =>
          <Link
            key={preset.href}
            href={preset.href}
            className={clsx("btn btn-sm rounded-full", { "btn-primary": isCurrent(preset.href) })}
          >
            {preset.title}
          </Link>)}
      </div>
      <form className="flex gap-2 items-center">
        <select name="filter_by" className="select select-bordered select-sm">
          {selectOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.title}</option>)}
        </select>
        <input type="text" name="filter_text" className="input input-sm input-bordered" placeholder="검색" />
      </form>
    </div>
  )
}