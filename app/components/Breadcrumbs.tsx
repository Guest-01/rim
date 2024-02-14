export default function Breadcrumbs({ tree }: { tree: string[] }) {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        {tree.map(name => <li key={name}>{name}</li>)}
      </ul>
    </div>
  )
}