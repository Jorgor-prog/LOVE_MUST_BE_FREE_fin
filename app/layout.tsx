import "./globals.css"
export const metadata = { title: "LOVE MUST BE FREE", description: "App" }
export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (<html lang="en"><body>{children}</body></html>)
}
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
