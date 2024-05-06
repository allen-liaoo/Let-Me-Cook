import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'
import { useEffect, useState } from 'react'
import { compare } from '../conversion.mjs'
import Layout from "../css/ItemPageLayout.module.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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

  const ingrAmountUnit = (ingredient) =>
      (ingredient.amount ? ' (' + ingredient.amount +
          (ingredient.unit && ingredient.unit !== '<unit>' ? ' ' + ingredient.unit : '') + ')' 
      : '')

  const foodQuantityUnit = (food) =>
      (food.quantity ? ' (' + food.quantity +
          (food.unit ? ' ' + food.unit : '') + ')' 
      : '')
  

  return <ListGroup.Item style={ 
      comparisonStatus < 0 ? {color: "red"} 
      : (comparisonStatus > 0 ? {color: "green"} : {}) }>
      <Row>
      <Col>{ ingredient ? ingredient.name + ingrAmountUnit(ingredient) : ''}</Col>
      <Col>{ food ? '  ' + food.name + foodQuantityUnit(food) : '' }</Col>
      </Row>
      </ListGroup.Item>
}

export default function QueueItemPopup({ showPopup, setShow, recipe }) {
  return <Modal show={showPopup} onHide={()=>setShow(false)}>
    <Modal.Header closeButton>
        <Modal.Title>{ recipe.name }</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    
    <ListGroup className="list-group-flush">
    <ListGroup.Item >
      <Row>
      <Col><h6>Recipe</h6></Col>
      <Col> <h6>Your Pantry</h6></Col>
      </Row>
      </ListGroup.Item>
      { recipe.ingredients.map((e,i) => 
        <IngredientFoodItem key={i} ingredient={e} />) }
    </ListGroup>
    </Modal.Body>
    </Modal>
}