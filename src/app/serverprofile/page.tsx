import { GET } from '@/app/api/profile/route'
import { GET as duplicateGet } from '@/app/api/profiles/route'
import { List } from '@/components/List'
import Link from 'next/link'

export default async function ServerProfilePage() {
  const data = await GET()
  const dataAsJson = await data.json()

  const dataAll = await duplicateGet()
  const dataAllJson = await dataAll.json()

  return (
    <>
      <Link href='/'>Home</Link>
      <List
        data={[
          { header: 'List header', description: JSON.stringify(dataAsJson) },
          { header: 'Random header', description: JSON.stringify(dataAllJson) },
        ]}
      />
    </>
  )
}
