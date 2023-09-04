import { NextResponse } from 'next/server'
import { getServerAuthSession } from '@/lib/auth'

export async function GET() {
  const session = await getServerAuthSession()
  return NextResponse.json({
    authenticated: !!session,
    session,
  })
}
