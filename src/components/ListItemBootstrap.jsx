import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Layout from "../css/ItemPageLayout.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { ReactComponent as UploadImage }  from '../assets/upload.svg'
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
          <ListGroup className="list-group-flush">
          <div className={Layout.text}>Quantity:   &ensp;
                    <input type="number" 
                        value={newQuantity} onChange={(e)=>setQuantity(e.target.value)}
                        min="0" />
                        </div>
        </ListGroup>

        <ListGroup className="list-group-flush">
        <div className={Layout.text}>Expiration Date: &ensp;
                    <input type="date" value={newExpirationDate} onChange={(e)=>setExpirationDate(e.target.value)}/>
                    </div>
        </ListGroup>
        <ListGroup className="list-group-flush">
          <div className = {Layout.centerrow}>
            <RemoveButton onClick={removeFood}/>
            <SaveButton onClick={editFood}/>
            </div>
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
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" height="25px">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier"> 
                <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
                <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> 
              </g>
            </svg>
          </button>
        </div>
      </Card.Body>
      <ListGroup className={Layout.text+" list-group-flush"}>
          Quantiny: { newQuantity ? newQuantity : "NA"}
      </ListGroup>
      <ListGroup className={Layout.text+" "+"list-group-flush"}>
          Expiration Date: { newExpirationDate ? newExpirationDate : "NA"}
      </ListGroup>
    </Card>
  </div>)
}
}