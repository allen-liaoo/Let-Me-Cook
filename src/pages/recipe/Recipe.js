import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ItemHeader from '../../components/ItemHeader'
import Layout from "../../css/ItemPageLayout.module.css"
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Recipe() {
    const { id } = useParams()
    const [recipe, setRecipe] = useState({})

    useEffect(() => {
        (async () => {
            const res = await fetch("/api/recipe/"+id, { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting recipe!")
                return
            }
            const resJson = await res.json()
            setRecipe(resJson.recipe)
        })()
    }, [])

    return (<div  className={Layout.switchRowCol}>
        <ItemHeader name={recipe.name} image={recipe.image} editLink={'/recipe/edit/'+id} />
        <div fluid="md" className={Layout.movecenter}>
            <div>

                <Row>
                    <Col xs={7}><a href={ recipe.instructions } className={Layout.movecenter + " " + Layout.biggertext}> Instructions</a></Col>
                </Row>
                <br /> <br />
                <Row className={Layout.IngredientsHeader + " " + Layout.bigtext}>Ingredients:</Row><br />
            { recipe.ingredients ? 
                recipe.ingredients.map((e,i) => {
                    console.log("RECIPE: ", recipe);
                    return <Row key={i} className="p-2">
                        { "- " + e.name.slice(0,1).toUpperCase() + e.name.slice(1) + ' (' + String(Math.round(Number(e.amount) * 100) / 100) + 
                            (e.unit 
                                && e.unit !== '' 
                                && e.unit !== '<unit>' ? ' ' + e.unit + 's' : '')
                            +')' } <br />
                    </Row>
                }
                ) 
                : <></> }
              </div>
        </div>
    </div>);
}