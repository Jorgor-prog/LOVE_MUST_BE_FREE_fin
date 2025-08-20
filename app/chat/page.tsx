export const dynamic = 'force-dynamic'
export const revalidate = false

import Image from 'next/image'
import UserTopBar from '@/components/UserTopBar'
import ChatPanel from './ChatPanel'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const s = await getSession()
  if (!s?.user) redirect('/login')
  if (s.user.role === 'ADMIN') redirect('/admin')

  return (
    <div style={{minHeight:'100dvh', position:'relative'}}>
      <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:'cover'}} />
      <div style={{position:'relative', zIndex:1}}>
        <UserTopBar />
        <main style={{maxWidth:900, margin:'0 auto', padding:'16px'}}>
          <ChatPanel />
        </main>
      </div>
    </div>
  )
}
