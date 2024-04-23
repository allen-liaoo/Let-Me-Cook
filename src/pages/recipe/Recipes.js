import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import ListItem from '../../components/ListItem'
import AddButton from '../../components/AddButton'
import Layout from "../../css/ItemPageLayout.module.css"

export default function Recipes() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/recipes", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting recipes!")
                return
            }
            console.log(res)
            const resJson = await res.json()
            console.log(resJson)
            setItems(resJson.recipes)
        })();
    }, [])

    return (
        <div>
            <div className ={Layout.centerrow}>
            <AddButton onClick={()=>{navigate('/recipe/create')}}/>
            </div>
            <Container>
                { items.map(e => 
                    <ListItem 
                        key={e._id}
                        name={e.name} 
                        description={e.instructions ? (e.instructions.slice(0,20) + '...') : ""}
                        image={e.image}
                        viewLink={'/recipe/'+e._id}
                        editLink={'/recipe/edit/'+e._id}
                    />)}
            </Container>
           
        </div>
    )
}