import { getSession } from "./lib/auth";

export default async function Home() {
  const payload = await getSession();
  return (
    <>
    <h2>Home Page</h2>
    <div>accountId: {payload?.accountId}</div>
    </>
  );
}
