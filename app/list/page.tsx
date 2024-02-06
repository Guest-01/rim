import prisma from "../lib/prisma"

export default async function List() {
  const issues = await prisma.issue.findMany();
  // console.log(issues);
  return (
    <div>
      <span>이슈 목록</span>
      {issues.map(issue => <div key={issue.id}>{issue.title}</div>)}
    </div>
  )
}