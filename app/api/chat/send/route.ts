export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const s = await getSession()
  if (!s) return NextResponse.json({ ok: false })
  const { toId, text } = await req.json()
  if (!toId || !text) return NextResponse.json({ ok: false })
  const m = await prisma.message.create({ data: { fromId: s.user.id, toId: Number(toId), text: String(text) } })
  return NextResponse.json({ ok: true, id: m.id })
}
