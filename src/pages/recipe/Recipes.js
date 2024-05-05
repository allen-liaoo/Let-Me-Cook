import { useEffect, useState } from "react"
import Container from 'react-bootstrap/Container'
import { useNavigate } from "react-router-dom"
import RecipeItemBootstrap from '../../components/RecipeItemBootstrap'
import AddButton from '../../components/AddButton'
import Layout from "../../css/ItemPageLayout.module.css"
import EmptyCard from "../../components/EmptyCard"

export default function Recipes() {
    const navigate = useNavigate()
    const [items, setItems] = useState([])
    const [loading,SetLoading] = useState(true);

    useEffect(() => {
        (async () => {
            SetLoading(true);
            const res = await fetch("/api/recipes", { method: "GET" })
            if (!res.ok) {
                console.log(res)
                window.alert("Error getting recipes!")
                return
            }
            console.log(res)
            const resJson = await res.json()
            console.log(resJson)
            setItems(resJson.recipes)
            console.log(items)
            SetLoading(false);
        })();
        console.log(loading + "loading ")
    }, [])

    if(loading){
        return <div>
            <div className ={Layout.centerrow+" "+Layout.stickaddbutton}>
            <AddButton onClick={()=>{navigate('/food/create')}}/>
            </div>
            <Container>
                <EmptyCard  feildnum= "2" isRecipe={true}></EmptyCard>
                <EmptyCard  feildnum= "2" isRecipe={true}></EmptyCard>
                <EmptyCard  feildnum= "2" isRecipe={true}></EmptyCard>
                <EmptyCard  feildnum= "2" isRecipe={true}></EmptyCard>
            </Container>
        </div>
    }

    else return (
        <div>
            <div className ={Layout.centerrow}>
            <AddButton onClick={()=>{navigate('/recipe/create')}}/>
            </div>
            <Container>
      
          
                { items.map(e => 
                    <RecipeItemBootstrap 
                        key={e._id}
                        id = {e._id}
                        name={e.name} 
                        description={e.instructions ? (e.instructions.slice(0,20) + '...') : ""}
                        image={e.image}
                        viewLink={'/recipe/'+e._id}
                        editLink={'/recipe/edit/'+e._id}
                    />)}
            </Container>
            <div className ={Layout.centerrow}>
            {!items.length?<div><h3>No Recipes saved</h3>
            <p>if you add a recipe item using the add button it will show up here </p></div>:<div></div>}
            </div>
        </div>
    )
}