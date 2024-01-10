import React from 'react'
import style from './navbar.module.css';

export default function Navbar({handleSignIn, handleSignUp}) {
  return (
    <div className={style.navbar_container}>
        <h1>MeMetrics</h1>
        <div className={style.navbar_user}>
            <button className={style.navbar_button} onClick={handleSignUp}>Register</button>
            <button className={style.navbar_button} onClick={handleSignIn}>Login</button>
        </div>
    </div>
  )
}
