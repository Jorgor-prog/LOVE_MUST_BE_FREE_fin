import { cookies } from "next/headers"
import { prisma } from "./prisma"

export async function getSession(){
  const token = cookies().get("session_token")?.value || ""
  if (!token) return null
  const s = await prisma.session.findUnique({ where: { token }, include: { user: { include: { profile: true, codeConfig: true } } } })
  if (!s) return null
  return { user: s.user }
}
