import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SaveButton from '../../components/SaveButton'
import ItemHeaderEditable from '../../components/ItemHeaderEditable'

export default function EditFood() {
    const navigate = useNavigate()
    const { id: _id } = useParams()
    const [name, setName] = useState("")
    const image = useState("")
    const [quantity, setQuantity] = useState(0)
    const [expirationDate, setExpirationDate] = useState("")

    async function editFood() {
        const res = await fetch('/api/food/edit/'+_id, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                image,
                quantity,
                expirationDate
            })
        })
        console.log('Editing Food', res)
        if (!res.ok) {
            window.alert("Failed editing food!")
            return
        }
        navigate('/food/' + _id)
    }

    return <div>
      <ItemHeaderEditable name={name} updateName={setName} image={image} />
        <div>
            <span>Quantity: 
                <input type="text" value={quantity} onChange={(e)=>setQuantity(e.target.value)}/></span>
            <span>Expiration Date: 
                <input type="text" value={expirationDate} onChange={(e)=>setExpirationDate(e.target.value)}/></span>
        </div>
      <SaveButton onClick={editFood}/>
    </div>
}