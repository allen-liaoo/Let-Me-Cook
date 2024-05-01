import { useState, useEffect } from 'react'
import { useLoaderData } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import ListItem from '../components/ListItemBootstrap';
export default function Landing() {
    // const clientDetails = useLoaderData()
    // console.log(clientDetails)
    const [expiringFoods, setExpiringFoods] = useState([])
    const [lowestFoods, setLowestFoods] = useState([])

    useEffect(()=> {
        (async ()=> {
            const res = await fetch("/api/foods/expiring", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting expiring foods!")
                return
            }
            const resJson = await res.json()
            console.log(resJson)
            setExpiringFoods(resJson.expiringFoods)
        })()
    },[])

    useEffect(()=> {
        (async ()=> {
            const res = await fetch("/api/foods/lowest", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting lowest quantity foods!")
                return
            }
            const resJson = await res.json()
            console.log(resJson)
            setLowestFoods(resJson.lowestQuantityFoods)
        })()
    },[])

    return (
      <div>
        {/* <h3>Food</h3>
        <ListItem image="https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg"
        description="A red fruit/vegitable dddddddddddddddddddddddddddddddd" name="tomato"></ListItem> */}
        <h3>Expiring Soon</h3>
        <Container>
            { expiringFoods.map(e=>
                <ListItem  
                key={e._id}
                id={e._id}
                name={e.name} 
                image={e.image}
                quantity={e.quantity}
                viewLink={'/food/'+e._id}
                editLink={'/food/edit/'+e._id}
                date = {e.expirationDate}
                />)
            }
        </Container>
        <h3>Lowest Quantity</h3>
        <Container>
            { lowestFoods.map(e=>
                <ListItem 
                    key={e._id}
                    id={e._id}
                    name={e.name} 
                    image={e.image}
                    quantity={e.quantity}
                    viewLink={'/food/'+e._id}
                    editLink={'/food/edit/'+e._id}
                    date = {e.expirationDate}
                />)
            }
        </Container>
      </div>
    );
}