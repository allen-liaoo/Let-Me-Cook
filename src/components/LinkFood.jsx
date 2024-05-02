import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SearchResult from './SearchResult'
function LinkFood({ foodName, updateFoodId, setShow }) {
 const [results, setResults] = useState([])
    async function searchFood() {
        const res = await fetch("/api/search/food", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({food: foodName})
        })
        if (!res.ok) {
          window.alert("Failed searching food!")
          return
      }
        const foods = await res.json()
        console.log(foods)
        setResults(foods.data)
    }
  return (
    <Modal animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Link food</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
      { results && results.length !== 0 ? 
        results.map((e,i) => 
        // using array index as keys here is fine so long as there is no way to add/remove elements from the array
          <div key={i} > 
            <SearchResult name={ e.name } image ={e.image}></SearchResult>
          </div>
        ) : <></> }
      </Modal.Body>
      <Modal.Footer>
        <button>
          Close
        </button>
        <button>
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default LinkFood;