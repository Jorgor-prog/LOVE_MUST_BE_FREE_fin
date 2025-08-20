export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSession } from "@/lib/cookies"

export async function POST(req: Request){
  const { loginId, password } = await req.json()
  const u = await prisma.user.findUnique({ where: { loginId } })
  if (!u) return NextResponse.json({ ok:false })
  const ok = u.loginPassword === password
  if (!ok) return NextResponse.json({ ok:false })
  const token = await createSession(u.id)
  cookies().set("session_token", token, { httpOnly:true, sameSite:"lax", secure:true, path:"/" })
  return NextResponse.json({ ok:true, role: u.role })
}
