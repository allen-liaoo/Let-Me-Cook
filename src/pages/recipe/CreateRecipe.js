import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"
import searchStyle from "../../css/Search.module.css"
import SearchResult from "../../components/SearchResultBootstrap";
export default function CreateRecipe() {
    const navigate = useNavigate()
    const [recipe, setRecipe] = useState("")
    const [results, setResults] = useState([])

    async function searchRecipe() {
        if (!recipe) return
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
        console.log(body._id)
        navigate('/recipe/'+body._id)
    }
    const [iconContainer, setIconContainer] = useState(searchStyle.searchIconContainer)
    useEffect(()=>{
      if(recipe === ""){
        setIconContainer(searchStyle.searchIconContainer)
      }else{
        setIconContainer(searchStyle.searchIconContainerWithText + " " + searchStyle.searchIconContainer)
      }

    },[recipe])

    // Let user search by clicking enter button
    document.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("searchNewRecipesButton").click();
      }
    });

    return <>
    <div className={searchStyle.centerContents}>
      <div className={iconContainer} >
      <input type="text" value={recipe} 
            onInput={(e)=>{setRecipe(e.target.value)}} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchRecipe()
              }
            }} 
            className={searchStyle.container}/>
      <button onClick={searchRecipe} id="searchNewRecipesButton" className ={searchStyle.searchbutton}>
        <p  className ={searchStyle.searchText}>Search</p>
        <img src ="https://upload.wikimedia.org/wikipedia/commons/0/0b/Search_Icon.svg" alt= "search"  className={searchStyle.searchicon}></img>
        </button>
      </div>
       </div>
   
      { results && results.length !== 0 ? 
        results.map((e,i) => 
        // using array index as keys here is fine so long as there is no way to add/remove elements from the array
          <div key={i} onClick={()=>{createRecipe(e)}}>
            <SearchResult name={ e.name } image ={e.image} url={e.url}></SearchResult>
          </div>
        ) : <></> }
    </>
}