import { cookies } from "next/headers"
import { prisma } from "./prisma"
import { randomUUID } from "crypto"

export async function createSession(userId: number){
  const token = randomUUID()
  await prisma.session.create({ data: { token, userId } })
  return token
}

export async function clearSession(token: string){
  await prisma.session.delete({ where: { token } }).catch(()=>{})
}
