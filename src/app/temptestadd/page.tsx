import { GET as add } from '@/app/api/users/add/route';

export default async function TempTestAddPage() {
  const user = await add();
  const aaa = await user.json();

  return <h1>add {JSON.stringify(aaa)}</h1>;
}
