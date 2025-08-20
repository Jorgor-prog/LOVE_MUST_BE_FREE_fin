// app/layout.tsx
import './globals.css'
import type { ReactNode } from 'react'

export const metadata = { title: 'LOVE MUST BE FREE', description: 'App' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
