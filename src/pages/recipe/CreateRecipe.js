import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function CreateRecipe() {
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState("")
    const [results, setResults] = useState([])

    async function searchRecipe() {
        const res = await fetch("/api/search/recipe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({recipe: recipe})
        })
        console.log(res)
        const recipes = await res.json()
        console.log(recipes)
        setResults(recipes.data)
    }

    async function createRecipe(recipe) {
        const res = await fetch('/api/recipe', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(recipe)
        })
        console.log('Creating recipe', res)
        if (!res.ok) {
            window.alert("Failed creating recipe!")
            return
        }
        const body = await res.json()
        navigate('/recipe/'+body._id)
    }

    return <>
      <input type="text" value={recipe} onInput={(e)=>{setRecipe(e.target.value)}}/>
      <button onClick={searchRecipe}>Search</button>
      { results && results.length !== 0 ? 
        results.map((e,i) => 
        // using array index as keys here is fine so long as there is no way to add/remove elements from the array
          <div key={i} onClick={()=>{createRecipe(e)}}>
            <span>{ e.name }</span>
          </div>
        ) : <></> }
    </>
}