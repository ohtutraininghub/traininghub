'use client'

import { List } from '@/components/List'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ClientProfilePage() {
  const [data, setData] = useState<string>('')
  const [dataAll, setDataAll] = useState<string>('')

  useEffect(() => {
    const fetchIt = async () => {
      const dataFetch = await fetch('api/profile')
      const dataJson = await dataFetch.json()

      setData(JSON.stringify(dataJson))

      const dataAllFetch = await fetch('api/profiles')
      const dataAllJson = await dataAllFetch.json()

      setDataAll(JSON.stringify(dataAllJson))
    }
    fetchIt()
  })

  return (
    <>
      <Link href='/'>Home</Link>
      <List
        data={[
          { header: 'List header', description: JSON.stringify(data) },
          { header: 'Random header', description: JSON.stringify(dataAll) },
        ]}
      />
    </>
  )
}
