import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const allUserData = await prisma.user.findMany({
    include: {
      accounts: true,
      sessions: true,
    },
  })

  return NextResponse.json({
    allUserData,
  })
}
