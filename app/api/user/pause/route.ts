export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request){
  const s = await getSession()
  if (!s) return NextResponse.json({ ok:false })
  const { paused } = await req.json()
  await prisma.codeConfig.upsert({ where:{ userId: s.user.id }, update: { paused: !!paused }, create: { userId:s.user.id, paused: !!paused } })
  return NextResponse.json({ ok:true })
}
