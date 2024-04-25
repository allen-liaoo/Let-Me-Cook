import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import ListItem from '../../components/ListItem'
import AddButton from '../../components/AddButton'

const testItems = [{
    _id: 12,
    name: "carrot",
    image: "abc123.png",
    quantity: 9,
    exp_in: "2026-01-01"
}, {
    _id: 15,
    name: "slim jim",
    quantity: 7,
    image: "woo.png",
    exp_in: "2026-01-01"
}]

function Foods() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/foods", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting foods!")
                return
            }
            console.log(res)
            const resJson = await res.json()
            console.log(resJson)
            setItems(resJson.foods)
            // setItems(testItems)
        })()
    }, [])

    return (
        <div>
            <Container>
                { items.map(e => 
                    <ListItem 
                        key={e._id}
                        name={e.name} 
                        image={e.image}
                        description={"Quantity: "+e.quantity}
                        viewLink={'/food/'+e._id}
                        editLink={'/food/edit/'+e._id}
                    />)}
            </Container>
            <AddButton onClick={()=>{navigate('/food/create')}}/>
        </div>
    );
}

export default Foods;