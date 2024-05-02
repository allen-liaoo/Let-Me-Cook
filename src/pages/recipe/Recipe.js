import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ItemHeader from '../../components/ItemHeader'
import Layout from "../../css/ItemPageLayout.module.css"
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

    return <div  className={Layout.switchRowCol}>
        <ItemHeader name={recipe.name} image={recipe.image} editLink={'/recipe/edit/'+id} />
        <div className={Layout.movecenter}>
            <div>
            Instructions: 
            <a href={ recipe.instructions }> Here</a>
            <br />
            Ingredients:
          { recipe.ingredients ? 
            recipe.ingredients.map((e,i) => {
                return <div key={i} >
                    { e.name + ' (' + e.amount + 
                        (e.unit 
                            && e.unit !== '' 
                            && e.unit !== '<unit>' ? ' ' + e.unit + 's' : '')
                         +')' } <br />
                </div>
            }
            ) 
            : <></> }
              </div>
        </div>
    </div>
}