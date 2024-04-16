import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ItemHeader from '../../components/ItemHeader'
import { Container, Row, Col } from 'react-bootstrap'

export default function Food() {
    const { id } = useParams()
    const [item, setItem] = useState({})
    const [recipesIn, setRecipesIn] = useState([])

    useEffect(() => {
        (async () => {
            // fetch item? or pass in as prop?
            // perhaps depending on if props are initialized
            setItem({
                _id: id,
            })
        })()

        (async () => {
            // fetch recipes this item is in
            setRecipesIn([])
        })()
    }, [])

    return <div>
        <ItemHeader name={item.name} image={item.image} />
        <div>
            <span>Quantity: {item.quantity}</span>
            <span>Expires in: {item.exp_in}</span>
        </div>
        <div>
            <span>Recipes in:</span>
            <Container>
                { recipesIn.map(e =>
                    <Row>
                        <Col>{e.name}</Col>
                        <Col>{e.instructions}</Col>
                    </Row>
                )}
            </Container>
        </div>
    </div>
}