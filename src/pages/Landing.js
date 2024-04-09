import { useLoaderData } from 'react-router-dom'

export default function Landing() {
    const clientDetails = useLoaderData()
    console.log(clientDetails)
    return (
      <p>Landing page for signed in user</p>
    );
}