import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import ListItem from '../../components/ListItemBootstrap'
import AddButton from '../../components/AddButton'
import Layout from "../../css/ItemPageLayout.module.css"
import EmptyCard from "../../components/EmptyCard"

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
    const[loading,SetLoading] = useState(true);
    useEffect(() => {
       
        (async () => {
            SetLoading(true);
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
            SetLoading(false);
        })()
        console.log(loading + "loading ")
        
    }, [])
    if(loading){
        return(
            <div>
            <div className ={Layout.centerrow+" "+Layout.stickaddbutton}>
            <AddButton onClick={()=>{navigate('/food/create')}}/>
            </div>
            <Container>
                <EmptyCard  feildnum= "2" ></EmptyCard>
                <EmptyCard  feildnum= "2" ></EmptyCard>
                <EmptyCard  feildnum= "2" ></EmptyCard>
                <EmptyCard  feildnum= "2" ></EmptyCard>
            </Container>
        </div>
        )
    }
    else{
    return (
        <div>
            <div className ={Layout.centerrow+" "+Layout.stickaddbutton}>
            <AddButton onClick={()=>{navigate('/food/create')}}/>
            </div>
            <Container>
                { items.map(e => 
                    <ListItem 
                        key={e._id}
                        id={e._id}
                        name={e.name} 
                        image={e.image}
                        quantity={e.quantity}
                        viewLink={'/food/'+e._id}
                        editLink={'/food/edit/'+e._id}
                        date = {e.expirationDate}
                    />)}
            </Container>
        </div>
    );
}
}
export default Foods;