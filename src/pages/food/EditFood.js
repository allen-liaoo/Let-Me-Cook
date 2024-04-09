import { useParams } from 'react-router-dom'
import SaveButton from '../../components/SaveButton'
export default function EditFood() {
    const { id } = useParams()
    return (
    <div>
      <p>Edit Food</p>
      <SaveButton></SaveButton>
    </div>
    );
}