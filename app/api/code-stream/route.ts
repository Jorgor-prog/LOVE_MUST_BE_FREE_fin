export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const s = await getSession()
  if (!s || s.user.role!=='USER') return new Response('', { status: 401 })
  const cfg = await prisma.codeConfig.upsert({ where:{ userId:s.user.id }, update:{}, create:{ userId:s.user.id } })
  const text = cfg.codeText || ''
  const interval = Math.max(30, Math.min(2000, cfg.intervalMs || 200))
  let idx = cfg.offset || 0
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller){
      let closed = false
      async function tick(){
        if (closed) return
        const fresh = await prisma.codeConfig.findUnique({ where:{ userId:s.user.id } })
        if (!fresh || fresh.paused){ setTimeout(tick, interval); return }
        const ch = text[idx] || ''
        if (!ch) { controller.close(); return }
        controller.enqueue(encoder.encode(`data: ${ch}

`))
        idx += 1
        if (idx % 20 === 0) await prisma.codeConfig.update({ where:{ userId:s.user.id }, data:{ offset: idx, lastStep: 6 } }).catch(()=>{})
        setTimeout(tick, interval)
      }
      tick()
      controller.signal.addEventListener('abort', ()=>{ closed = true; prisma.codeConfig.update({ where:{ userId:s.user.id }, data:{ offset: idx } }).catch(()=>{}) })
    }
  })
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control":"no-cache" } })
}
