import { cookies as nextCookies } from 'next/headers'

const SESSION_COOKIE = 'session'

type CookieStore = ReturnType<typeof nextCookies> | any

function jar(c?: CookieStore) {
  return c ?? nextCookies()
}

export function getSessionToken(c?: CookieStore): string {
  return jar(c).get(SESSION_COOKIE)?.value || ''
}

export async function createSession(token: string, c?: CookieStore): Promise<void> {
  jar(c).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  })
}

export async function clearSession(c?: CookieStore): Promise<void> {
  jar(c).delete(SESSION_COOKIE)
}
