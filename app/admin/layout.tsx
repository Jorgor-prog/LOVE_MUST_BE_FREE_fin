import './admin.css'
import AdminTopBar from '@/components/AdminTopBar'
import Image from 'next/image'
import BackdropLogo from '@/components/BackdropLogo'

export const revalidate = false

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', minHeight: '100dvh' }}>
      <Image src="/images/Background_1.webp" alt="" fill style={{ objectFit: 'cover' }} priority />
      <BackdropLogo />
      <AdminTopBar />
      <main style={{ padding: 16 }}>{children}</main>
    </div>
  )
}
