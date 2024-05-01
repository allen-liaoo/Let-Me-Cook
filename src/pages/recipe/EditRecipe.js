import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import SaveButton from '../../components/SaveButton'
import RemoveButton from '../../components/RemoveButton'
import ItemHeaderEditable from '../../components/ItemHeaderEditable'
import Layout from "../../css/ItemPageLayout.module.css"
export default function EditRecipe() {
  const navigate = useNavigate()
  const { id: _id } = useParams()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [instructions, setInstructions] = useState("")
  const [ingredients, setIngredients] = useState([])

  useEffect(() => {
      (async () => {
          const res = await fetch("/api/recipe/"+_id, { method: "GET" })
          if (!res.ok) {
              console.log(res)
              window.alert("Error getting recipe on edit recipe page!")
              return
          }
          const resJson = await res.json()
          const recipe = resJson.recipe
          setName(recipe.name)
          setImage(recipe.image)
          setInstructions(recipe.instructions)
          setIngredients(recipe.ingredients)
      })()
  }, [])

  async function editRecipe() {
      const res = await fetch('/api/recipe/edit/'+_id, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              name,
              image
          })
      })
      console.log('Editing Recipe', res)
      if (!res.ok) {
          window.alert("Failed editing recipe!")
          return
      }
      navigate('/recipe/' + _id)
  }

  async function removeRecipe() {
      const res = await fetch('/api/recipe/delete/'+_id, { method: "POST" })
      console.log('Deleting Recipe', res)
      if (!res.ok) {
          window.alert("Failed deleting recipe!")
          return
      }
      navigate('/recipes')
  }

  return <div className={Layout.switchRowCol}>
     <div className={Layout.flexgrow+" "+Layout.ref}>
    <ItemHeaderEditable name={name} image={image} updateName={setName} />
   
    </div>
    <div className={Layout.movecenter}>
    <div>
    <div className={Layout.row+" "+Layout.ajustright}>
    
    <RemoveButton onClick={removeRecipe}/>
    <SaveButton onClick={editRecipe}/>
    </div>
        { "Instructions: "}
          <a href={ instructions }>{"Here"}</a>
          <br />
          { ingredients ? <span>Ingredients: </span> : <></> }
          { ingredients ? 
                ingredients.map((e,i) => {
                    return <div key={i} >
                       {/* { e.text } <br /> */}
                        Name: { e.name } &ensp;
                        Amount: { e.amount } &ensp;
                        Unit: { e.unit } &ensp;
                        
                    </div>
                })
            : <></> }
      </div>
      </div>
  </div>
}