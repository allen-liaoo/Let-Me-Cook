import { useState, useEffect } from 'react';
import Layout from '../css/ItemPageLayout.module.css'
import styles from "../css/QueueItem.module.css";
import { Container, Card, ListGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

export default function LinkedFood({ foodId, hidePopup }) {
    const [food, setFood] = useState([])
    useEffect(() => {
      (async () => {
          const res = await fetch("/api/food/"+foodId, { method: "GET" })
          if (!res.ok) {
            window.alert("Failed getting linked food!")
            return
          }
          const foods = await res.json()
          console.log(foods)
          setFood(foods.food)
      })()
  }, [])

  return (
    <Modal show="true" animation={false} onHide={hidePopup}>
      <Modal.Header closeButton>
        <Modal.Title>{food ? food.name : 'Loading...'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        { food ? 
            <>
            {/* <img src={food.image} alt="food" /> */}
            <ListGroup variant="flush">
              <ListGroup.Item className={`${Layout.text} list-group-flush`}>
                   Quantiny: { food.quantity ? food.quantity : "NA"}
              </ListGroup.Item>
              <ListGroup.Item className={Layout.text+" "+"list-group-flush"}>
                   Unit: { food.unit ? food.unit : "NA"}
              </ListGroup.Item>
              <ListGroup.Item className={`${Layout.text} list-group-flush`}>
                    Expiration Date: { food.expirationDate ? food.expirationDate : "NA"}
               </ListGroup.Item>
            </ListGroup>
            </>
            :  <></>
        }
      </Modal.Body>
    </Modal>
  );
}