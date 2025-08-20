'use client'

import { useEffect, useState } from 'react'

export default function SaveToast({ text }: { text: string }) {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null
  return (
    <div style={{alignSelf:'center', color:'#22c55e', fontWeight:600}}>✔ {text}</div>
  )
}
