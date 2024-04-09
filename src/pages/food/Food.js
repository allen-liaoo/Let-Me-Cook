import { useParams } from 'react-router-dom'
export default function Food() {
    const { id } = useParams()
    return (
      <p>Food page to view food info (require sign in)</p>
    );
}