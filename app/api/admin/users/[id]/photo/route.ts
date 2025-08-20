export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { id: string } }){
  const id = Number(params.id)
  const fd = await req.formData()
  const f = fd.get("photo") as File | null
  if (!f) return NextResponse.json({ ok:false })
  const buf = Buffer.from(await f.arrayBuffer())
  const ext = f.type.includes("png") ? "png" : (f.type.includes("jpeg")||f.type.includes("jpg")) ? "jpg" : "webp"
  const name = `u_${id}_${Date.now()}.${ext}`
  const path = `public/uploads/${name}`
  const fs = await import("fs")
  await fs.promises.mkdir("public/uploads", { recursive:true })
  await fs.promises.writeFile(path, buf)
  const url = `/uploads/${name}`
  await prisma.profile.upsert({ where:{ userId:id }, update:{ photoUrl:url }, create:{ userId:id, photoUrl:url } })
  return NextResponse.json({ ok:true, photoUrl: url })
}
