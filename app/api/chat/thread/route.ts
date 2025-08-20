export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const s = await getSession()
  if (!s || s.user.role !== "ADMIN") return NextResponse.json({ messages: [] })
  const url = new URL(req.url)
  const userId = Number(url.searchParams.get("userId"))
  if (!userId) return NextResponse.json({ messages: [] })
  const ms = await prisma.message.findMany({ where: { OR: [{ fromId: s.user.id, toId: userId }, { fromId: userId, toId: s.user.id }] }, orderBy: { id: "asc" } })
  return NextResponse.json({ messages: ms })
}
