import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import FoodItem from '../../components/FoodItem'
import AddButton from '../../components/AddButton'
import Layout from "../../css/ItemPageLayout.module.css"
import EmptyCard from "../../components/EmptyCard"

function Foods() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        (async () => {
            setLoading(true);
            const res = await fetch("/api/foods", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting foods!")
                return
            }
            console.log(res)
            const resJson = await res.json()
            console.log(resJson)
            setItems(resJson.foods.reverse())
            // setItems(testItems)
            setLoading(false);
        })()
        console.log(loading + "loading ")
    }, [])
    

    if(loading){
        return <div>
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
    }

    else return <>
            <AddButton onClick={()=>{navigate('/food/create')}}/>

            <Container className={Layout.text}>

                { items.map(e => 
                    <FoodItem key={e._id} food={e}/>)}
            </Container>
            <div className ={Layout.centerrow}>
            {!items.length?<div className ={Layout.center}><h2>No Food items in pantry</h2>
            <p >if you add a food item using the add button it will show up here </p></div>:<div></div>}
            </div>
        </>
}
export default Foods;