import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SaveButton from '../../components/SaveButton'
import RemoveButton from '../../components/RemoveButton'
import ItemHeaderEditable from '../../components/ItemHeaderEditable'
import Layout from "../../css/ItemPageLayout.module.css"
export default function EditFood() {
    const navigate = useNavigate()
    const { id: _id } = useParams()
    const [name, setName] = useState("")
    const [image, setImage] = useState("")
    const [quantity, setQuantity] = useState(0)
    const [expirationDate, setExpirationDate] = useState("")

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/food/"+_id, { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting food on edit food page!")
                return
            }
            const resJson = await res.json()
            const food = resJson.food
            setName(food.name)
            setImage(food.image)
            setQuantity(food.quantity)
            setExpirationDate(food.expirationDate)
        })()
    }, [])

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

    async function removeFood() {
        const res = await fetch('/api/food/delete/'+_id, { method: "POST" })
        console.log('Deleting Food', res)
        if (!res.ok) {
            window.alert("Failed deleting food!")
            return
        }
        navigate('/foods')
    }

    return <div className={Layout.switchRowCol}>
      <ItemHeaderEditable name={name} image={image} updateName={setName} />
        <div className={Layout.row+" "+Layout.ajustright}>
        <SaveButton onClick={editFood}/>
        <RemoveButton onClick={removeFood}/> 
        </div>
        <div className={Layout.movecenter}>     
        <div>  
                <div className={Layout.text}>Quantity: 
                    <input type="number" 
                        value={quantity} onChange={(e)=>setQuantity(e.target.value)}
                        min="0" />
                        </div>
                <div className={Layout.text}>Expiration Date: 
                    <input type="date" value={expirationDate} onChange={(e)=>setExpirationDate(e.target.value)}/>
                    </div>
        </div>
        </div>
    </div>
}