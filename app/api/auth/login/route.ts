import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { createSession } from '@/lib/cookies'

async function readBody(req: Request) {
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const b = await req.json()
    return { loginId: String(b.loginId || ''), password: String(b.password || '') }
  }
  const fd = await req.formData()
  return { loginId: String(fd.get('loginId') || ''), password: String(fd.get('password') || '') }
}

export async function POST(req: Request) {
  const { loginId, password } = await readBody(req)
  if (!loginId || !password) return NextResponse.json({ error: 'missing' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { loginId } })
  if (!user) return NextResponse.json({ error: 'invalid' }, { status: 401 })

  const ok = await compare(password, user.loginPassword)
  if (!ok) return NextResponse.json({ error: 'invalid' }, { status: 401 })

  const token = crypto.randomUUID()
  await prisma.session.create({ data: { token, userId: user.id } })
  await createSession(token)

  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const to = user.role === 'ADMIN' ? '/admin' : '/dashboard'
  const res = NextResponse.redirect(new URL(to, base))
  res.headers.set('Cache-Control', 'no-store')
  return res
}
