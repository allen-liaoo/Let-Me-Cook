import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ItemHeader from '../../components/ItemHeader'

export default function Food() {
    const { id } = useParams()
    const [item, setItem] = useState({})

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/food/"+id, { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting food!")
                return
            }
            const resJson = await res.json()
            setItem(resJson.food)
            // setRecipesIn([])
        })()
    }, [])

    return <div>
        <ItemHeader name={item.name} image={item.image} editLink={'/food/edit/'+id} />
        <div>
            <span>Quantity: {item.quantity}</span>
            <span>Expiration Date: {item.expirationDate}</span>
          
        </div>
        {/* <div>
            <span>Recipes in:</span>
            <Container>
                { recipesIn.map(e =>
                    <Row>
                        <Col>{e.name}</Col>
                        <Col>{e.instructions}</Col>
                    </Row>
                )}
            </Container>
        </div> */}
    </div>
}