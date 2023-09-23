import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();

  const users = await prisma.user.findMany({ select: { name: true } });
  return NextResponse.json({
    data: { users: users, test_env: process.env.TEST_ENV || 'undef' },
  });
}
