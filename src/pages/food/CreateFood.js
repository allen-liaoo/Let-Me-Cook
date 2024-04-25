import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom"
import searchStyle from "../../css/Search.module.css"
import SerarchResult from "../../components/SearchResult";
export default function CreateFood() {
    const navigate = useNavigate()
    const [food, setFood] = useState("")
    const [results, setResults] = useState([])

    async function searchFood() {
        const res = await fetch("/api/search/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({food: food})
        })
        if (!res.ok) {
          window.alert("Failed searching food!")
          return
      }
        const foods = await res.json()
        console.log(foods)
        setResults(foods.data)
    }

    async function createFood(food) {
        const res = await fetch('/api/food', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(food)
        })
        console.log('Creating Food', res)
        if (!res.ok) {
            window.alert("Failed creating food!")
            return
        }
        const body = await res.json()
        navigate('/food/'+body._id)
    }
    const [iconContainer, setIconContainer] = useState(searchStyle.searchIconContainer)
    useEffect(()=>{
      if(food == ""){
        setIconContainer(searchStyle.searchIconContainer)
      }else{
        setIconContainer(searchStyle.searchIconContainerWithText + " " + searchStyle.searchIconContainer)
      }

    },[food])

    return (<div>
    <div className={searchStyle.centerContents}>
      <div className={iconContainer} >
        <input type="text" value={food} onInput={(e)=>{setFood(e.target.value)}} className={searchStyle.container} />
        <button onClick={searchFood}  className ={searchStyle.searchbutton}>
        <p  className ={searchStyle.searchText}>Search</p>
        <img src ="https://upload.wikimedia.org/wikipedia/commons/0/0b/Search_Icon.svg" alt= "search"  className={searchStyle.searchicon}></img>
        
        </button>
      </div>
    </div>
      { results && results.length !== 0 ? 
        results.map((e,i) => 
        // using array index as keys here is fine so long as there is no way to add/remove elements from the array
          <div key={i} onClick={()=>{createFood(e)}}> 
            <SerarchResult name={ e.name } image ={e.image}></SerarchResult>
            
          </div>
        ) : <></> }
    </div>)
}