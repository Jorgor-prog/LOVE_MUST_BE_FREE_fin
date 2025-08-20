import UserTopBar from "@/components/UserTopBar"
import Image from "next/image"

export default function Page(){
  return (
    <div style={{minHeight:"100dvh", position:"relative"}}>
      <div style={{position:"fixed", inset:0, zIndex:-1}}>
        <Image src="/images/Background_1.webp" alt="" fill style={{objectFit:"cover"}} />
      </div>
      <UserTopBar />
      <div className="container">
        <div className="card"><h2>Dashboard</h2></div>
      </div>
    </div>
  )
}
