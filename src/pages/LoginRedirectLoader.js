import { redirect } from "react-router-dom"

export default async function loginRedirectLoader() {
    // check user first time login
    const res = await fetch('/api/login', { method: "GET" })
    console.log(res)
    return redirect('/')
}