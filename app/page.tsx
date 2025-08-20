import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/auth'

export default async function Page() {
  const me = await getSessionUser()
  if (!me) redirect('/login')
  if (me.role === 'ADMIN') redirect('/admin')
  redirect('/dashboard')
}
