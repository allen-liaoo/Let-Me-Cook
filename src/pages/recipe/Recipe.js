import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ItemHeader from '../../components/ItemHeader'
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

    return <div>
        <ItemHeader name={recipe.name} image={recipe.image} />
        <span>Instructions: {recipe.instructions}</span>
        <div>Ingredients:
          { recipe.ingredients ? 
            recipe.ingredients.map((e,i) => {
                return <div key={i}>
                    Name: { e.name } <br />
                    Amount: { e.amount } <br />
                    Unit: { e.unit } <br />
                    Text: { e.text } <br />
                </div>
            }) 
            : <></> }
        </div>
    </div>
}