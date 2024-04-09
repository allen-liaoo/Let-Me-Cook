import { useParams } from 'react-router-dom'
export default function Recipe() {
    const { id } = useParams()
    return (
      <p>Recipe (no s)</p>
    );
}