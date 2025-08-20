import Image from "next/image"

export default function Page(){
  return (
    <div style={{ position:"relative", minHeight:"100dvh" }}>
      <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}}/>
      <div style={{ position:"absolute", inset:0, display:"grid", placeItems:"center" }}>
        <div className="card" style={{ minWidth:320, width:360 }}>
          <form action="/api/auth/login" method="post" onSubmit={(e)=>{ e.preventDefault(); const f=e.target as HTMLFormElement; const d=new FormData(f); fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({loginId:d.get('loginId'),password:d.get('password')})}).then(r=>r.json()).then(j=>{ if(j.ok){ location.href=j.role==='ADMIN'?'/admin':'/dashboard' } }) }} className="col">
            <input name="loginId" className="input" placeholder="Your login" />
            <input name="password" type="password" className="input" placeholder="Your password" />
            <button className="btn primary" style={{ width:"100%" }}>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
