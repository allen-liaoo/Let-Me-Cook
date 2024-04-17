import { redirect } from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'
import styles from '../css/Login.module.css';

export async function authLoader() {
    const res = await fetch("/.auth/me")
    const resJ = await res.json()
    const client = resJ.clientPrincipal
    if (!client) {
        return client
    }
    return redirect('/')
}

const loginBaseUrl = '/.auth/login/'
const redirectParam = '?post_login_redirect_uri=/login/redirect'

function loginOnClick(url) {
    return () => window.location.href = loginBaseUrl+url+redirectParam
}

export default function Login() {
    return <Stack gap={3}>
        <h1>Let Me Cook</h1>
        <span>Login/Signup</span>
        <button className={styles.button+" p-2"} onClick={loginOnClick('google')}>Google</button>
        <button className={styles.button+" p-2"}  onClick={loginOnClick('github')}>Github</button>
        <button className={styles.button+" p-2"}  onClick={loginOnClick('aad')}>Microsoft Identity Platform</button>
        <button className={styles.button+" p-2"}  onClick={loginOnClick('facebook')}>Facebook</button>
        <button className={styles.button+" p-2"}  onClick={loginOnClick('twitter')}>Twitter/X</button>
        <button className={styles.button+" p-2"}  onClick={loginOnClick('apple')}>Apple</button>
    </Stack>
}