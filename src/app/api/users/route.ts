import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({ select: { name: true } });
  return NextResponse.json({
    data: users,
  });
}
