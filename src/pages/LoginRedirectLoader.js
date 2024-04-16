import { redirect } from "react-router-dom"

export default function loginRedirectLoader() {
    // check user first time login
    return redirect('/')
}