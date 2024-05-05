import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import SearchResult from './SearchResultBootstrap';
import Button from '../css/Buttons.module.css';
import { Placeholder } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'

export default function LinkFoodPopup({ ingredient, hidePopup }) {
 const [results, setResults] = useState([])
 const [loading,setLoading] = useState(true)
    useEffect(() => {
      (async () => {
          setLoading(true)
          const res = await fetch("/api/food/byname", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({name: ingredient.name })
          })
          if (!res.ok) {
            window.alert("Failed searching food by ingredient name!")
            return
          }
          const foods = await res.json()
          console.log(foods)
          setResults(foods.foods)
          setLoading(false)
      })()
  }, [])

  function linkIngredient(foodId) {
    ingredient.foodId = foodId
    hidePopup(ingredient)
  }

  return (
    <Modal show="true" animation={false} onHide={()=>hidePopup(ingredient)}>
      <Modal.Header closeButton>
        <Modal.Title>Searching pantry for "{ingredient ? ingredient.name : ''}"</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {loading? <Placeholder as={Card.Text} animation="glow"><Placeholder xs={4} /></Placeholder>:<>
      { results && results.length !== 0 ? 
        results.map((e,i) => 
        // using array index as keys here is fine so long as there is no way to add/remove elements from the array
        <div key={i} onClick={()=>linkIngredient(e._id)}> 
        <SearchResult name={ e.name } image ={e.image}></SearchResult>
          </div>
        ) : <>{'\"' + ingredient.name + '\" not in pantry'}</> }</>}
      </Modal.Body>
      {/* <Modal.Footer>
        <button>
          Close
        </button>
        <button>
          Save Changes
        </button>
      </Modal.Footer> */}
    </Modal>
  );
}