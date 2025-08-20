'use client'

import { useEffect, useRef, useState } from 'react'

type Msg = { id:number; text:string; createdAt:string; isMine?:boolean }

export default function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const [adminId, setAdminId] = useState<number | null>(null)
  const [sending, setSending] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  async function loadAdmin() {
    try {
      const r = await fetch('/api/chat/admin-id', { cache:'no-store' })
      if (r.ok) {
        const j = await r.json()
        setAdminId(j.id ?? null)
      }
    } catch {}
  }

  async function loadMessages() {
    try {
      const r = await fetch('/api/chat/thread-user', { cache:'no-store' })
      if (r.ok) {
        const j = await r.json()
        setMessages(j.messages ?? [])
      }
    } catch {}
  }

  async function send() {
    if (!text.trim() || sending || !adminId) return
    setSending(true)
    const payload = { toId: adminId, text: text.trim() }
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      })
      if (r.ok) {
        setText('')
        await loadMessages()
      }
    } finally {
      setSending(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  useEffect(() => {
    loadAdmin()
    loadMessages()
    const t = setInterval(loadMessages, 2000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  return (
    <div style={{display:'grid', gridTemplateRows:'1fr auto', height:'calc(100dvh - 120px)', background:'rgba(0,0,0,.45)', border:'1px solid rgba(255,255,255,.15)', borderRadius:16}}>
      <div style={{overflow:'auto', padding:16}}>
        {messages.length === 0 ? (
          <div style={{color:'rgba(255,255,255,.75)', textAlign:'center', padding:'32px 0'}}>Немає повідомлень</div>
        ) : (
          messages.map(m => (
            <div key={m.id} style={{display:'flex', justifyContent: m.isMine ? 'flex-end' : 'flex-start', margin:'8px 0'}}>
              <div style={{maxWidth:'75%', padding:'10px 12px', borderRadius:12, background: m.isMine ? 'rgba(255,255,255,.15)' : 'rgba(0,0,0,.35)', color:'#fff', border:'1px solid rgba(255,255,255,.15)'}}>
                <div style={{whiteSpace:'pre-wrap', wordBreak:'break-word'}}>{m.text}</div>
                <div style={{opacity:.7, fontSize:12, marginTop:6}}>{new Date(m.createdAt).toLocaleString()}</div>
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <div style={{display:'flex', gap:8, padding:12, borderTop:'1px solid rgba(255,255,255,.12)'}}>
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Напишіть повідомлення..."
          style={{flex:1, padding:'12px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.06)', color:'#fff'}}
        />
        <button onClick={send} disabled={sending || !adminId} style={{padding:'12px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,.3)', background:'rgba(255,255,255,.14)', color:'#fff', fontWeight:700, minWidth:110}}>
          {sending ? '...' : 'Відправити'}
        </button>
      </div>
    </div>
  )
}
