import { redirect } from 'react-router-dom'

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

export default function Login() {
    return <div>
        <a href={loginBaseUrl+'aad'+redirectParam}>Log in with the Microsoft Identity Platform</a> <br />
        <a href={loginBaseUrl+'facebook'+redirectParam}>Log in with Facebook</a> <br />
        <a href={loginBaseUrl+'google'+redirectParam}>Log in with Google</a> <br />
        <a href={loginBaseUrl+'twitter'+redirectParam}>Log in with Twitter</a> <br />
        <a href={loginBaseUrl+'apple'+redirectParam}>Log in with Apple</a> <br />
    </div>
}