export const dynamic = 'force-dynamic'
export const revalidate = false

import Image from 'next/image'
import LoginForm from './LoginForm'

export default function Page() {
  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <Image src="/images/Background_1.webp" alt="" fill style={{ objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'absolute' }}>
          <Image src="/images/Logo_3.webp" alt="" width={260} height={260} />
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
