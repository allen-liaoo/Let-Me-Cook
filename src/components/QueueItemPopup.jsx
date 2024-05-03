import Modal from 'react-bootstrap/Modal'
import ListGroup from 'react-bootstrap/ListGroup'

export default function QueueItemPopup({ showPopup, setShow, recipe }) {
  return <Modal show={showPopup} onHide={()=>setShow(false)}>
    <Modal.Header closeButton>
        <Modal.Title>{ recipe.name }</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <ListGroup className="list-group-flush">
      { recipe.ingredients.map((e,i) => 
        <ListGroup.Item key={i}>{e.name}</ListGroup.Item>) }
    </ListGroup>
    </Modal.Body>
    </Modal>
}