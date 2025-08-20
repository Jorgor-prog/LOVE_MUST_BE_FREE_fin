export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(){
  const s = await getSession()
  if (!s || s.user.role!=='ADMIN') return NextResponse.json({ users: [] })
  const users = await prisma.user.findMany({ where: { role: "USER" }, include:{ profile:true, codeConfig:true } })
  return NextResponse.json({ users })
}

export async function POST(req: Request){
  const s = await getSession()
  if (!s || s.user.role!=='ADMIN') return NextResponse.json({})
  const { adminNoteName } = await req.json()
  const loginId = `user_${Date.now()}`
  const loginPassword = Math.random().toString(36).slice(2,8)
  const u = await prisma.user.create({ data: { role:"USER", loginId, loginPassword, adminNoteName, profile: { create: {} }, codeConfig: { create: {} } } })
  return NextResponse.json({ ok:true, id: u.id, credentials: { loginId, loginPassword } })
}
