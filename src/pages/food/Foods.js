import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import ListItem from '../../components/ListItem'
import AddButton from '../../components/AddButton'

const testItems = [{
    _id: 12,
    name: "carrot",
    description: "bland",
    image: "abc123.png",
    quantity: 9,
    exp_in: "2026-01-01"
}, {
    _id: 15,
    name: "slim jim",
    description: "great",
    image: "woo.png",
    exp_in: "2026-01-01"
}]

function Foods() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems(testItems)
    }, [])

    return (
        <div>
            <Container>
                { items.map(e => 
                    <ListItem 
                        key={e._id}
                        name={e.name} 
                        description={e.description}
                        image={e.image}
                        viewLink={'/foods/'+e._id}
                        editLink={'/foods/edit/'+e._id}
                    />)}
            </Container>
            <AddButton onClick={()=>{navigate('/food/create')}}/>
        </div>
    );
}

export default Foods;