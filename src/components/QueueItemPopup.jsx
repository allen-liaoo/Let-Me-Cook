import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import { useEffect, useState } from 'react'
import { compare } from '../conversion.mjs'

function IngredientFoodItem({ ingredient }) {
  const [food, setFood] = useState()
  const [comparisonStatus, setComparisonStatus] = useState(0) // 0, 1, or -1 (see conversion.compare)

  useEffect(() => {
    if (!ingredient?.foodId) return
    (async () => {
      const res = await fetch("/api/food/"+ingredient.foodId, { method: "GET" })
      if (!res.ok) {
          console.log(res)
          window.alert("Error getting food for ingredient!")
          return
      }
      const resJson = await res.json()
      setFood(resJson.food)
      const status = compare(resJson.food.quantity, resJson.food.unit, ingredient.amount, ingredient.unit)
      console.log(`status for ${ingredient.name} `, status)
      setComparisonStatus(status)
    })()
  }, [])

  return <ListGroup.Item style={ 
      comparisonStatus < 0 ? {color: "red"} 
      : (comparisonStatus > 0 ? {color: "green"} : {}) }>
      { ingredient.name + '  ' + ingredient.amount + ' ' + ingredient.unit }
      { food ? '  ' + food.name + ' ' + food.quantity + ' ' + food.unit : '' }</ListGroup.Item>
}

export default function QueueItemPopup({ showPopup, setShow, recipe }) {
  return <Modal show={showPopup} onHide={()=>setShow(false)}>
    <Modal.Header closeButton>
        <Modal.Title>{ recipe.name }</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <ListGroup className="list-group-flush">
      { recipe.ingredients.map((e,i) => 
        <IngredientFoodItem key={i} ingredient={e} />) }
    </ListGroup>
    </Modal.Body>
    </Modal>
}