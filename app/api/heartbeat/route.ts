import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const me = await getSessionUser()
  if (me) {
    await prisma.user.update({
      where: { id: me.id },
      data: { isOnline: true, lastSeen: new Date() }
    })
  }
  return NextResponse.json({ ok: true })
}
