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
        // get all food of user
        setItems(testItems)
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
                        viewLink={'/foods/'+e._id}
                        editLink={'/foods/edit/'+e._id}
                    />)}
            </Container>
            <AddButton onClick={()=>{navigate('/food/create')}}/>
        </div>
    );
}

export default Foods;