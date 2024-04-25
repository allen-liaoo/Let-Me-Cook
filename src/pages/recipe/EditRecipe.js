import { useParams } from 'react-router-dom'
export default function EditRecipe() {
    const { id } = useParams()
    return (
      <p>Edit Recipe</p>
    );
}