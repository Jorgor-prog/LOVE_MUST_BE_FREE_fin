import { prisma } from "./prisma"
import { cookies } from "next/headers"
import { randomUUID } from "crypto"
import { compare } from "bcryptjs"
import type { User } from "@prisma/client"

export async function createSession(userId: number) {
  const token = randomUUID()
  await prisma.session.create({ data: { token, userId } })
  const store = await cookies()
  store.set("session_token", token, { httpOnly: true, sameSite: "lax", path: "/" })
  return token
}

export async function getSessionToken() {
  const store = await cookies()
  return store.get("session_token")?.value ?? null
}

export async function getSession() {
  const token = await getSessionToken()
  if (!token) return null
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true }
  })
  return session ?? null
}

export async function getSessionUser(): Promise<User | null> {
  const session = await getSession()
  return session?.user ?? null
}

export async function clearSession() {
  const token = await getSessionToken()
  if (token) {
    await prisma.session.delete({ where: { token } }).catch(() => {})
  }
  const store = await cookies()
  store.delete("session_token")
}

export async function login(loginId: string, password: string) {
  const u = await prisma.user.findUnique({ where: { loginId } })
  if (!u) return null
  let ok = false
  try { ok = await compare(password, u.loginPassword) } catch { ok = false }
  if (!ok) ok = password === u.loginPassword
  if (!ok) return null
  await createSession(u.id)
  return u
}
