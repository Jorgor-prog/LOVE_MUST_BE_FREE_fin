import './globals.css'

export const metadata = { title: 'LOVE MUST BE FREE', description: 'App' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <img src="/images/Logo_3.webp" className="user-logo-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  )
}
