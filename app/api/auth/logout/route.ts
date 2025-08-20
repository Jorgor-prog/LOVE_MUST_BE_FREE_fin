export const dynamic = "force-dynamic"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { clearSession } from "@/lib/cookies"

export async function POST(){
  const token = cookies().get("session_token")?.value || ""
  if (token) await clearSession(token)
  cookies().set("session_token","",{ httpOnly:true, path:"/", maxAge:0 })
  return NextResponse.json({ ok:true })
}
