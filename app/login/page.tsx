import s from './login.module.css'

export const metadata = { title: 'Sign in' }

export default function Page() {
  return (
    <div className={s.wrap}>
      <div className={s.logo}>
        <img src="/Logo_3.png" alt="Logo" />
      </div>
      <form className={s.card} method="post" action="/api/auth/login">
        <h1 className={s.title}>Sign in</h1>
        <input className={s.input} name="loginId" type="text" placeholder="Login" required />
        <input className={s.input} name="password" type="password" placeholder="Password" required />
        <button className={s.btn} type="submit">Continue</button>
      </form>
    </div>
  )
}
