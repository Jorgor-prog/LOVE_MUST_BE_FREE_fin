export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const s = await getSession()
  if (!s) return NextResponse.json({})
  if (s.user.role === "ADMIN") {
    const m = await prisma.message.findFirst({ where: { toId: s.user.id }, orderBy: { id: "desc" }, select: { id: true } })
    return NextResponse.json({ latest: m?.id || 0 })
  } else {
    const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } })
    if (!admin) return NextResponse.json({ latestId: 0 })
    const m = await prisma.message.findFirst({ where: { fromId: admin.id, toId: s.user.id }, orderBy: { id: "desc" }, select: { id: true } })
    return NextResponse.json({ latestId: m?.id || 0 })
  }
}
