import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  const s = await getSession()
  if (!s?.user || s.user.role !== 'ADMIN') return new NextResponse('Forbidden', { status: 403 })
  const { userId, photoUrl } = await req.json()
  if (!userId) return new NextResponse('Bad Request', { status: 400 })
  await prisma.profile.upsert({
    where:{ userId },
    update:{ photoUrl: photoUrl || null },
    create:{ userId, photoUrl: photoUrl || null }
  })
  return NextResponse.json({ ok:true })
}
