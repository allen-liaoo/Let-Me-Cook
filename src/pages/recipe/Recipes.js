import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import ListItem from '../../components/ListItem'
import AddButton from '../../components/AddButton'

export default function Recipes() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])

    useEffect(() => {
        setItems([])
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
    )
}