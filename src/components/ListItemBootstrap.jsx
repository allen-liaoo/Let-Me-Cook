import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Layout from "../css/ItemPageLayout.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { ReactComponent as UploadImage }  from '../assets/upload.svg'
import { ReactComponent as EditSVG }  from '../assets/edit.svg'
import { ReactComponent as DeleteSVG }  from '../assets/delete.svg'
import { useState, useEffect } from 'react';
import SaveButton from './SaveButton'
import RemoveButton from './RemoveButton'


export default function ListItem({id, name, date, quantity, image: oldImage}){
  const [editMode, setEditMode] = useState(0);
  const [newName,setName] = useState(name)
  const [image, setImage] = useState(oldImage)
  const [newImageFile, setNewImageFile] = useState(null)
  const [newQuantity, setQuantity] = useState(quantity)
  const [newExpirationDate, setExpirationDate] = useState(date)
  const [setofclasses, Setsetofclases] = useState(styles.wholeCard +" "+Layout.centerrow)
  const [getinfo,setGetinfo] = useState(1);
  const [imgFiles] = useState([]);
  useEffect(() => {
    (async () => {
      if(getinfo){
        const res = await fetch("/api/food/"+id, { method: "GET" })
        if (!res.ok) {
            console.log(res)
            window.alert("Error getting food on edit food page!")
            return
        }
        const resJson = await res.json()
        const food = resJson.food
        console.log("updating");
        console.log(food.name);
        setName(food.name)
        setImage(food.image)
        setQuantity(food.quantity)
        setExpirationDate(food.expirationDate)
    }})()
}, [editMode])
  
  async function editFood() {
    const res = await fetch('/api/food/edit/'+id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: newName,
            quantity: newQuantity,
            expirationDate: newExpirationDate
        })
    })
    console.log('Editing Food', res)
    if (!res.ok) {
        window.alert("Failed editing food!")
        return
    }

    if (newImageFile != null) {
        const formData = new FormData()
        formData.append('image', newImageFile)
        const res = await fetch('/api/food/edit/image/'+id, {
            method: "POST",
            // headers: {
            //     "Content-Type": "multipart/form-data"
            // },  // dont specify content type so it is set with boundary
            body: formData
        })
        console.log('Changing image of food', res)
        if (!res.ok) {
            window.alert("Failed to change image of food!")
            return
        }
    }

    //navigate('/food/' + id)
    setEditMode(0)
}

async function removeFood() {
    const res = await fetch('/api/food/delete/'+id, { method: "POST" })
    console.log('Deleting Food', res)
    if (!res.ok) {
        window.alert("Failed deleting food!")
        return
    }
    //navigate('/foods')
    Setsetofclases(styles.wholeCard +" "+Layout.centerrow+" "+Layout.hidden)
    setGetinfo(0)
    setEditMode(0)
    console.log(editMode)
}


  async function uploadImage(e) {
      if (e.target.files.length <= 0) return
      const file = e.target.files.item(0);
      console.log("Image selected", file)
      if (file.size > 10000000) {    // 10,000,000 bytes = 10 mb
          console.alert("Image file is too large (> 10mb)!")
          return
      }
      setNewImageFile(file)
  }

  if(editMode){
    return(
    <div className={setofclasses}>

        <Card className={styles.customCard}>
          <Card.Body className={styles.cardBody}>
            <div className={styles.innerBodyContainer}>
                <label htmlFor="file-input" className={styles.imgcontainer}>

                  {image?
                 
                  <Card.Img className={styles.cardImg} src={image}/>
                  :
                  <div className={styles.cardImgHolder} ></div>}

                  <UploadImage className={styles.uploadSvg}/>
                </label>
                {/* Upload image */}
                <input id="file-input" type="file" accept="image/*" capture="environment"
                    value={imgFiles}
                    onChange={uploadImage} className={styles.hidden}/>

              <div className={styles.cardTextContainer}>
                {/* Change text */}
              <input className={styles.inputTitle} 
                value={newName} onInput={(e)=>setName(e.target.value)}
                maxLength="50" />
              </div>

            </div>
          </Card.Body>
          <ListGroup variant="flush">
          <ListGroup.Item className="list-group-flush">
          <div className={Layout.text}>Quantity:   &ensp;
                    <input type="number" 
                        value={newQuantity} onChange={(e)=>setQuantity(e.target.value)}
                        min="0" />
                        </div>
        </ListGroup.Item>

        <ListGroup.Item className="list-group-flush">
          
        <div className={Layout.text}>Expiration Date: &ensp;
                    <input type="date" value={newExpirationDate} onChange={(e)=>setExpirationDate(e.target.value)}/>
                    </div>
        </ListGroup.Item>
        <ListGroup.Item className="list-group-flush">
          <div className = {Layout.centerrow}>
            <RemoveButton onClick={removeFood}/>
            <SaveButton onClick={editFood}/>
            </div>
        </ListGroup.Item>
        </ListGroup>
        </Card>
      </div>)
  }else{
  return (
  <div className={setofclasses}>
    <Card className={styles.customCard}>
      <Card.Body>
        <div className={styles.innerBodyContainer}>
          <Card.Img className={styles.cardImg} src={image}/>
          <div className={styles.cardTextContainer}>
            <Card.Text className={styles.cardText}>{newName}</Card.Text>
          </div>
          <button className={styles.iconContainer+ " "+styles.editButton} onClick={(e)=>setEditMode(1)}> 
            <EditSVG />
          </button>
        </div>
      </Card.Body>

      <ListGroup variant="flush">
    
        <ListGroup.Item className={Layout.text+" "+"list-group-flush"}>
             Quantiny: { newQuantity ? newQuantity : "NA"}
        </ListGroup.Item>
         
        <ListGroup.Item className={Layout.text+" "+"list-group-flush"}>
              Expiration Date: { newExpirationDate ? newExpirationDate : "NA"}
         </ListGroup.Item>
      </ListGroup>

    </Card>
  </div>)
}
}