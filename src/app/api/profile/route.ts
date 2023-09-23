import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const usersss = await prisma.user.deleteMany();
  return NextResponse.json({
    data: usersss,
  });
}
