export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(){
  const s = await getSession()
  if (!s) return NextResponse.json({ ok:false })
  await prisma.codeConfig.upsert({ where:{ userId:s.user.id }, update:{ paused:false, lastStep:6 }, create:{ userId:s.user.id, paused:false, lastStep:6 } })
  return NextResponse.json({ ok:true })
}
