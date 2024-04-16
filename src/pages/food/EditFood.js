import { useParams } from 'react-router-dom'
import SaveButton from '../../components/SaveButton'
export default function EditFood() {
    const { id } = useParams()

    function editFood() {

    }

    return <div>
      <p>Edit Food</p>
      <SaveButton />
    </div>
}