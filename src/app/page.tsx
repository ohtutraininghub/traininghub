import { SignOutButton } from '@/components/SignOut'
import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <SignOutButton />
      <br />
      <Link href='/clientprofile'>Client profile</Link>
      <br />
      <Link href='/serverprofile'>Server profile</Link>
    </>
  )
}
