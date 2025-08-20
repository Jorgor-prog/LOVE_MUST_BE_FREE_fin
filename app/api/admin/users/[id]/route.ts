export const dynamic = "force-dynamic"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }){
  const s = await getSession()
  if (!s || s.user.role!=='ADMIN') return NextResponse.json({})
  const id = Number(params.id)
  const user = await prisma.user.findUnique({ where:{ id }, include:{ profile:true, codeConfig:true } })
  return NextResponse.json({ user })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }){
  const s = await getSession()
  if (!s || s.user.role!=='ADMIN') return NextResponse.json({})
  const id = Number(params.id)
  const body = await req.json()
  const data:any = {}
  if (body.loginId!==undefined) data.loginId = String(body.loginId)
  if (body.loginPassword!==undefined) data.loginPassword = String(body.loginPassword)
  if (body.adminNoteName!==undefined) data.adminNoteName = String(body.adminNoteName)
  if (body.profile) {
    await prisma.profile.upsert({ where:{ userId:id }, update: body.profile, create:{ userId:id, ...body.profile } })
  }
  if (body.codeConfig) {
    await prisma.codeConfig.upsert({ where:{ userId:id }, update: body.codeConfig, create:{ userId:id, ...body.codeConfig } })
  }
  if (Object.keys(data).length) await prisma.user.update({ where:{ id }, data })
  const user = await prisma.user.findUnique({ where:{ id }, include:{ profile:true, codeConfig:true } })
  return NextResponse.json({ user })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }){
  const s = await getSession()
  if (!s || s.user.role!=='ADMIN') return NextResponse.json({})
  const id = Number(params.id)
  await prisma.user.delete({ where: { id } }).catch(()=>{})
  return NextResponse.json({ ok:true })
}
