export const dynamic = "force-dynamic"
import { getSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(){
  const s = await getSession()
  return NextResponse.json(s || {})
}
