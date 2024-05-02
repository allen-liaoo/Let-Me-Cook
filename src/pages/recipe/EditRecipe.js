import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import SaveButton from '../../components/SaveButton'
import RemoveButton from '../../components/RemoveButton'
import ItemHeaderEditable from '../../components/ItemHeaderEditable'
import Layout from "../../css/ItemPageLayout.module.css"
import Buttons from "../../css/Buttons.module.css"
export default function EditRecipe() {
  const navigate = useNavigate()
  const { id: _id } = useParams()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [instructions, setInstructions] = useState("")
  const [ingredients, setIngredients] = useState([])
  const [newImageFile, setNewImageFile] = useState(null)

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
              image,
              ingredients
          })
      })
      console.log('Editing Recipe', res)
      if (!res.ok) {
          window.alert("Failed editing recipe!")
          return
      }

      if (newImageFile != null) {
        const formData = new FormData()
        formData.append('image', newImageFile)
        const res = await fetch('/api/recipe/edit/image/'+_id, {
            method: "POST",
            // dont specify content type so it is set with boundary
            body: formData
        })
        console.log('Changing recipe of food', res)
        if (!res.ok) {
            window.alert("Failed to change image of recipe!")
            return
        }
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

  function changeIngredients(idx,field,value) {
    ingredients.map((e,i) => {
        if (i===idx) e[field] = value
        return e
    })
    setIngredients([...ingredients]);
  }
  
  function addIngredients() {
    setIngredients([...ingredients, {name:"",unit:"",amount:0}])
  }
 
  function removeIngredients(idx) {
    const newIng = ingredients.filter((e,i) => {
        return i !== idx
    })
    console.log(idx)
    console.log(newIng)
    setIngredients(newIng);
  }

  return (
  <div className={Layout.switchRowCol}>
    <div className={Layout.flexgrow+" "+Layout.ref+" "+Layout.centerrow}>
        <ItemHeaderEditable name={name} image={image} updateName={setName} updateImage={setNewImageFile} />
   
    </div>
    <div className={Layout.movecenter}>
        <div>
            <div className={Layout.row+" "+Layout.ajustright}>
        </div>
        <div className={Layout.row}>
        <RemoveButton onClick={removeRecipe}/>
        <SaveButton onClick={editRecipe}/>
        </div>
    
        { "Instructions: "}
        <a href={ instructions }>{"Here"}</a>
        <br />
        { ingredients ? <span>Ingredients: </span> : <></> }
        { ingredients ? 
            (<Container>
            { ingredients.map((e,i) => 
                <Row  key={i} className={Layout.centerrow}>
                {/* <div key={i} className={Layout.centerrow}> */}
                <Col xs= {"1"}></Col>
                    <Col xs= {"2"}><input type="number" className={Layout.ingredientInput} onChange={(e)=>changeIngredients(i,"amount",e.target.value)}
                        value={e.amount} 
                        min="0" /></Col>
                    <Col xs= {"2"}><input type="text" className={Layout.ingredientInput} onChange={(e)=>changeIngredients(i,"unit",e.target.value)}
                        value={
                            !e.unit || e.unit === "<unit>" ? "" : e.unit
                        } placeholder="unit" /></Col>
                    <Col  ><div >(s)&ensp; of</div></Col>
                    <Col xs= {"3"}><input type="text" className={Layout.ingredientInput} onChange={(e)=>changeIngredients(i,"name",e.target.value)}
                        value={e.name}/></Col>
                    <Col>
                    <button className={Buttons.minusButton} onClick={()=>removeIngredients(i)}>x</button>
                    </Col>
                    <Col xs= {"2"}></Col>
                {/* </div> */}
                </Row>
            )}
            </Container>)
            : <></> }
        <div className = {Layout.centerrow}>
            <button className = {Buttons.saveButton} onClick ={ addIngredients}> + </button>
        </div>
             
    </div>
     
    </div>
     
  </div>)
}