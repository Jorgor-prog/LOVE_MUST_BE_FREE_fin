import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const me = await getSessionUser()
  if (!me) return new NextResponse("Unauthorized", { status: 401 })

  const cfg = await prisma.codeConfig.upsert({
    where: { userId: me.id },
    update: {},
    create: { userId: me.id }
  })

  const text = cfg.codeText ?? ""
  const upto = cfg.offset ?? 0
  const currentText = text.slice(0, upto).split("").join(" ")

  return NextResponse.json({
    intervalMs: cfg.intervalMs ?? 200,
    lastStep: cfg.lastStep ?? 1,
    paused: cfg.paused ?? false,
    currentText
  })
}
