import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../css/Queue.module.css";
import QueueItem from "../../components/QueueItem";
import Layout from "../../css/ItemPageLayout.module.css"
import { useState, useEffect } from 'react';
import AddRecipeQueuePopup from '../../components/AddRecipeQueuePopup';

function moveInArray(array, item, from, to) {
  array.splice(from, 1);
  array.splice(to, 0, item);
}

function incrAndGetMapValue(map, key) {
  if (map.has(key))
    map.set(key, map.get(key)+1)
  else map.set(key, 0)
  return map.get(key)
}

export default function RecipeQueue() {
  // Tried to have items as a state, didn't work well because we can't map a state if it's set as an empty array
  const [ recipeIds, setRecipeIds ] = useState([])
  // We need to use unique keys for child components to prevent rerender
  // each recipe could appear more than once, so this need to be unique per instance of recipe, 
  // and be independent of recipe index (since it could be reordered)
  // EXAMPLE: A recipe that is the second duplicate( at initial fetch/insertion) recieves the key recpId+"2"
  const [ recipeKeys, setRecipeKeys ] = useState([])
  const [ recipeCountMap ] = useState(new Map()) // not rendered, keeps track of num of duplicates per recipe
  const [ draggingRecpIndex, setDraggingRecpIndex ] = useState(-1)

  useEffect(() => {
    (async () => {
        const res = await fetch("/api/queue", {
          method: "GET",
        })
        if (!res.ok) {
          window.alert("Error getting user's recipe queue!")
          return
        }
        const body = await res.json()
        console.log(body)
        setRecipeIds(body.queue)

        // calculate recipe keys
        const recpKeys = []
        for (const recipeId of body.queue) {
          incrAndGetMapValue(recipeCountMap, recipeId)
          recpKeys.push(recipeId+recipeCountMap.get(recipeId)+"")
        }
        setRecipeKeys(recpKeys)
        console.log("recpkeys, ", recpKeys)
        console.log("recp map, ", recipeCountMap)
    })()
  }, [])

  async function updateQueue(newItems) {
    const res = await fetch(`/api/recipe/queue`, {
      method: "POST",
      body: JSON.stringify({
        recipes: newItems
      })
    })
    if (!res.ok) {
      window.alert("Error updating recipe queue!")
      return
    }
    setRecipeIds(newItems)
  }

  const handleDragStart = (e, recpIndex) => {
    console.log("drag start: ", recpIndex)
    setDraggingRecpIndex(recpIndex);
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragEnd = (e) => {
    console.log("drag end")
    // setDraggingRecpIndex(-1); dont set!!
  }

  const handleDragOver = (e) => {
    console.log("drag over")
    e.preventDefault();
  }

  const handleDrop = (e, targetRecpIndex) => {
    console.log("drop: ", targetRecpIndex)
    if (draggingRecpIndex < 0) return;

    const draggedRecpId = recipeIds[draggingRecpIndex]
    const draggedRecpKey = recipeKeys[draggingRecpIndex]

    if (targetRecpIndex !== -1) {
      // move order of recipe ids and keys
      moveInArray(recipeIds, draggedRecpId, draggingRecpIndex, targetRecpIndex)
      moveInArray(recipeKeys, draggedRecpKey, draggingRecpIndex, targetRecpIndex)
      updateQueue(recipeIds)
      setDraggingRecpIndex(-1)
    }
  }

  function addRecipe(recpId) {
    // calculate recipe key by consulting count map
    incrAndGetMapValue(recipeCountMap, recpId)
    recipeKeys.push(recpId+recipeCountMap.get(recpId))
    updateQueue([...recipeIds, recpId])
  }

  function deleteRecipe(recpIndex) {
    recipeKeys.splice(recpIndex, 1) // delete recipe's key at index
    updateQueue(recipeIds.filter((r,ind)=>recpIndex!==ind))
  }

  return (
    <div>
      <AddRecipeQueuePopup addRecipe={addRecipe} className={Layout.stickaddbutton}/>
      <div className={styles.queueList} align="left">
     
        { recipeIds ? 
          recipeIds.map((recpId,i) => (
            <div
              key={recipeKeys[i]} // need to use i because of possible duplicates
              className=
                {`${styles.grow} ${recpId === draggingRecpIndex ?
                  'dragging' : ''
                }`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, i) }
              onDragEnd={() => handleDragEnd()}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, i)}>
                <QueueItem key={recipeKeys[i]}
                    recipeId={recpId}
                    deleteItem={deleteRecipe} />
            </div>
          ))
        : <div></div>}
 {!recipeIds.length?<div className ={Layout.center}><h2>No Recipes in queue</h2>
            <p >you can add saved recipes to your queue here </p></div>:<div></div>}
      </div>
      
    </div>
  );
}
