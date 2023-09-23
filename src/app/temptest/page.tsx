import { GET as deleteeee } from '@/app/api/profile/route';

export default async function TempTestPage() {
  const user = await deleteeee();
  const aaaaa = await user.json();

  return <h1>del {JSON.stringify(aaaaa)}</h1>;
}
