import Image from "next/image"

export const metadata = { title: "Sign in | LOVE MUST BE FREE" }

export default function LoginPage() {
  return (
    <div style={{position:"relative", minHeight:"100dvh"}}>
      <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} priority />
      <div style={{position:"absolute", inset:0, display:"grid", placeItems:"center"}}>
        <form method="post" action="/api/auth/login" style={{width:"100%", maxWidth:420, background:"rgba(0,0,0,.6)", padding:24, borderRadius:16, color:"#fff", backdropFilter:"blur(6px)"}}>
          <div style={{textAlign:"center", marginBottom:16}}>
            <Image src="/images/Logo_3.webp" alt="Logo" width={120} height={120} />
            <h1 style={{marginTop:12, fontSize:22, fontWeight:700}}>Sign in</h1>
          </div>
          <label style={{display:"block", fontSize:12, opacity:.9}}>Login</label>
          <input name="loginId" required placeholder="Enter login" autoComplete="username" style={{width:"100%", marginTop:6, marginBottom:14, padding:"10px 12px", borderRadius:10, border:"1px solid #333", background:"#0b1220", color:"#fff"}} />
          <label style={{display:"block", fontSize:12, opacity:.9}}>Password</label>
          <input type="password" name="password" required placeholder="Enter password" autoComplete="current-password" style={{width:"100%", marginTop:6, marginBottom:18, padding:"10px 12px", borderRadius:10, border:"1px solid #333", background:"#0b1220", color:"#fff"}} />
          <button type="submit" style={{width:"100%", padding:"10px 14px", borderRadius:10, border:"none", background:"#1e90ff", color:"#fff", fontWeight:700}}>Continue</button>
          <p style={{marginTop:10, textAlign:"center", fontSize:12, opacity:.8}}>Having trouble? Contact support.</p>
        </form>
      </div>
    </div>
  )
}
