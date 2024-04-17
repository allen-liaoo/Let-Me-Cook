import { useState } from "react";
import { useNavigate } from "react-router-dom"

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

    return <>
      <input type="text" value={food} onInput={(e)=>{setFood(e.target.value)}}/>
      <button onClick={searchFood}>Search</button>
      { results && results.length !== 0 ? 
        results.map((e,i) => 
        // using array index as keys here is fine so long as there is no way to add/remove elements from the array
          <div key={i} onClick={()=>{createFood(e)}}> 
            <span>{ e.name }</span>
          </div>
        ) : <></> }
    </>
}