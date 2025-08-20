'use client'
import Image from 'next/image'

export default function BackdropLogo() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 grid place-items-center">
      <Image
        src="/images/Logo_3.webp"
        alt=""
        width={720}
        height={720}
        style={{ maxWidth: '60vw', maxHeight: '60vh', objectFit: 'contain', opacity: 0.15 }}
        priority={false}
      />
    </div>
  )
}
