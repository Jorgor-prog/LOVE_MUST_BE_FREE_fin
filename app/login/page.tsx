import './login.css'

export const metadata = { title: 'Sign in' }

export default function Page() {
  return (
    <div className="login-wrap">
      <div className="login-logo">
        <img src="/Logo_3.png" alt="Logo" />
      </div>
      <form className="login-card" method="post" action="/api/auth/login">
        <h1 className="login-title">Sign in</h1>
        <input className="login-input" name="loginId" type="text" placeholder="Login" required />
        <input className="login-input" name="password" type="password" placeholder="Password" required />
        <button className="login-btn" type="submit">Continue</button>
      </form>
    </div>
  )
}
