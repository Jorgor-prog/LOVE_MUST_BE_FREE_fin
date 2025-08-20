import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/login?msg=logged-out', req.url))
  res.headers.set('Set-Cookie', 'session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax; Secure')
  res.headers.set('Cache-Control', 'no-store')
  return res
}
