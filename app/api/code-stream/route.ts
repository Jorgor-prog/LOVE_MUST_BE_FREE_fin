import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(req: Request) {
  const s = await getSession()
  if (!s?.user) return new NextResponse("Unauthorized", { status: 401 })

  const cfg = await prisma.codeConfig.upsert({
    where: { userId: s.user.id },
    update: {},
    create: { userId: s.user.id }
  })

  let code = cfg.codeText ?? ""
  let interval = Math.min(2000, Math.max(30, cfg.intervalMs ?? 200))
  let paused = cfg.paused ?? false
  let idx = cfg.offset ?? 0
  let closed = false
  const enc = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      function send(data: string) {
        controller.enqueue(enc.encode(`data: ${data}\n\n`))
      }
      function tick() {
        if (closed) return
        if (paused) { setTimeout(tick, 300); return }
        if (idx >= code.length) { send("[END]"); controller.close(); return }
        const ch = code[idx]
        const payload = ch === "\n" ? "<br/>" : ch
        send(payload)
        idx++
        if (idx % 20 === 0) prisma.codeConfig.update({ where: { userId: s.user.id }, data: { offset: idx } }).catch(() => {})
        setTimeout(tick, interval)
      }
      tick()

      req.signal.addEventListener("abort", () => {
        closed = true
        prisma.codeConfig.update({ where: { userId: s.user.id }, data: { offset: idx } }).catch(() => {})
      })
    },
    cancel() {
      closed = true
      prisma.codeConfig.update({ where: { userId: s.user.id }, data: { offset: idx } }).catch(() => {})
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive"
    }
  })
}
