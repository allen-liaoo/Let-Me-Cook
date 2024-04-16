import { useState } from "react";

export default function CreateFood() {
    const [food, setFood] = useState("")

    async function searchFood() {
        const res = await fetch("/api/search/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({food: food})
        })
        console.log(res)
        console.log(await res.json())
    }

    return <>
      <input type="text" value={food} onInput={(e)=>{setFood(e.target.value)}}/>
      <button onClick={searchFood}>Search</button>
    </>
}