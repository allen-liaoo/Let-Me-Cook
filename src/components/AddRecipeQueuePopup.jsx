import Modal from 'react-bootstrap/Modal'
import styles from "../css/QueueItem.module.css";
import ListGroup from 'react-bootstrap/ListGroup'
import SearchResult from './SearchResultBootstrap';
import Layout from "../css/ItemPageLayout.module.css";
import AddButton from '../components/AddButton';
import { useEffect, useState } from 'react'
import { ReactComponent as Enqueue }  from '../assets/enqueue.svg'

export default function AddRecipeQueuePopup({ addRecipe }) {
  const [show, setShow] = useState(false)
  const [recipes, setRecipes] = useState([])

  async function setShowPopup(show) {
    if (show) {
      const res = await fetch("/api/recipes", { method: "GET" })
      if (!res.ok) {
          console.log(res)
          window.alert("Error getting recipes!")
          return
      }
      console.log(res)
      const resJson = await res.json()
      console.log(resJson)
      setRecipes(resJson.recipes)
    }
    if (!show) setRecipes([])
    setShow(show)
  }

  return <>
    <AddButton onClick={()=>setShowPopup(true)}/>
    <Modal show={show} onHide={()=>setShowPopup(false)}>
    <Modal.Header closeButton>
        <Modal.Title>Add Recipe to Queue</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <ListGroup className="list-group-flush">
    { recipes && recipes.length !== 0 ? 
        recipes.map((e,i) =>
          // using array index as keys here is fine so long as there is no way to add/remove elements from the array
          <div key={i} onClick={()=>{
            addRecipe(e._id)
            setShow(false)
          }}> 
            <SearchResult name={ e.name } image={e.image}
                buttonComp={
                <button className={styles.enqueueButton} > 
                  <Enqueue  className={styles.enqueue}/>
                </button>}></SearchResult>
          </div>
        ) : <></> }
    </ListGroup>
    </Modal.Body>
    </Modal>
  </>
}