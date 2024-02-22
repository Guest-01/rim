import Link from "next/link";

type FilterHeaderProps = {
  presets: { href: string; title: string; }[],
  selectOptions: { title: string; value: string; }[],
}

export default function FilterHeader({ presets, selectOptions }: FilterHeaderProps) {
  return (
    <div className="p-4 flex justify-between">
      <div className="flex gap-2 items-center">
        <span className="label label-text">필터</span>
        {presets.map(preset => <Link key={preset.href} href={preset.href} className="btn btn-sm rounded-full">{preset.title}</Link>)}
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