'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminTopBar from '@/components/AdminTopBar'

export default function Page(){
  const [users,setUsers] = useState<any[]>([])
  const [note,setNote] = useState('')
  const [cred,setCred] = useState<any|null>(null)
  async function load(){
    const j = await fetch('/api/admin/users',{cache:'no-store'}).then(x=>x.json())
    setUsers(j.users||[])
  }
  useEffect(()=>{ load() },[])
  async function createUser(){
    const j = await fetch('/api/admin/users',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ adminNoteName: note })}).then(x=>x.json())
    setCred(j.credentials||null); setNote(''); load()
  }
  function copyCred(){
    if (!cred) return
    navigator.clipboard.writeText(`login: ${cred.loginId} password: ${cred.loginPassword}`)
  }
  return (
    <div style={{minHeight:'100dvh', position:'relative'}}>
      <AdminTopBar />
      <div className="container">
        <div className="card">
          <h2>Users</h2>
          <div className="row">
            <input className="input" placeholder="Admin note name" value={note} onChange={e=>setNote(e.target.value)} />
            <button className="btn primary" onClick={createUser}>Create</button>
            {cred ? <button className="btn" onClick={copyCred}>Copy credentials</button> : null}
          </div>
        </div>
        <div className="card" style={{marginTop:12}}>
          <div className="col">
            {users.map(u=>(<Link className="link" key={u.id} href={`/admin/users/${u.id}`}>{u.adminNoteName||u.loginId}</Link>))}
          </div>
        </div>
      </div>
    </div>
  )
}
