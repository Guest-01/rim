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