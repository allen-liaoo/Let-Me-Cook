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

export default function FoodItem({ food }) {
  const [editMode, setEditMode] = useState(0);
  const [name,setName] = useState(food.name ?? "")
  const [image, setImage] = useState(food.image ?? "")
  const [newImageFile, setNewImageFile] = useState(null)
  const [quantity, setQuantity] = useState(food.quantity ?? 0)
  const [unit, setUnit] = useState(food.unit ?? "")
  const [expirationDate, setExpirationDate] = useState(food.expirationDate ?? "")
  const [setofclasses, setSetofClasses] = useState(styles.wholeCard +" "+Layout.centerrow)
  const [getinfo,setGetinfo] = useState(true);
  const [isNoQuantity,setIsNoQuantity] = useState(false);
  const [isExpired,setIsExpired] = useState(false);
  const [imgFiles] = useState([]);
  useEffect(() => {
    (async () => {
      if(getinfo){
        const res = await fetch("/api/food/"+food._id, { method: "GET" })
        if (!res.ok) {
            console.log(res)
            window.alert("Error getting food on edit food page!")
            return
        }
        const resJson = await res.json()
        const newFood = resJson.food
        console.log("updating");
        console.log(newFood);
        setName(newFood.name)
        setImage(newFood.image)
        setQuantity(newFood.quantity)
        setUnit(newFood.units)
        setExpirationDate(newFood.expirationDate)
        setExpirationDateAndQuantity(food);
    }})()
  }, [editMode, getinfo]);
  
  async function editFood() {
    const res = await fetch('/api/food/edit/'+food._id, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            quantity: quantity,
            expirationDate: expirationDate,
            unit: unit
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
        const res = await fetch('/api/food/edit/image/'+food._id, {
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
    setEditMode(false)
}

function setExpirationDateAndQuantity(food) {
  const curTime = getCurTime();
  if (!food.expirationDate || food.expirationDate === "NA" || food.expirationDate < curTime) {
    console.log("Adding expired flag");
    setIsNoQuantity(true);
  }
  if (!food.quantity || food.quantity === "NA" || food.quantity <= 0) {
    console.log("Adding noQuantity flag");
    setIsExpired(true);
  }
}

async function removeFood() {
    const res = await fetch('/api/food/delete/'+food._id, { method: "POST" })
    console.log('Deleting Food', res)
    if (!res.ok) {
        window.alert("Failed deleting food!")
        return
    }
    //navigate('/foods')
    setSetofClasses(styles.wholeCard +" "+Layout.centerrow+" "+Layout.hidden)
    setGetinfo(false)
    setEditMode(false)
    console.log(editMode)
}

  // Gets String of current date in yyyy-mm-dd format
  function getCurTime() {
    const curDate = new Date();
    var curYear = String(curDate.getFullYear());
    var curMonth = String(curDate.getMonth() + 1); // 0-indexed
    var curDay = String(curDate.getDate());
    if (curDay.length < 2) {
        curDay = "0" + curDay;
    }
    if (curMonth.length < 2) {
        curMonth = "0" + curMonth;
    }
    var curTime = curYear + "-" + curMonth + "-" + curDay;
    return curTime;
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
                  : <div className={styles.cardImgHolder} ></div> }

                  <UploadImage className={styles.uploadSvg}/>
                </label>
                {/* Upload image */}
                <input id="file-input" type="file" accept="image/*" capture="environment"
                    value={imgFiles}
                    onChange={uploadImage} className={styles.hidden}/>

              <div className={styles.cardTextContainer}>
                {/* Change text */}
              <input className={styles.inputTitle} 
                value={name} onInput={(e)=>setName(e.target.value)}
                maxLength="50" />
              </div>

            </div>
          </Card.Body>
          <ListGroup variant="flush">
          <ListGroup.Item className={`list-group-flush`}>
            <div className={Layout.text}>Quantity:   &ensp;
              <input type="text" 
                value={quantity} onChange={(e)=>setQuantity(e.target.value)}
                min="0"/>
            </div>
          </ListGroup.Item>

          <ListGroup.Item className="list-group-flush">
          <div className={Layout.text}>Unit:   &ensp;
          <input type="text" 
              value={unit} onChange={(e)=>setUnit(e.target.value)} />
              </div>
          </ListGroup.Item>

          <ListGroup.Item className={`list-group-flush`}>
          <div className={`Layout.text`}>Expiration Date: &ensp;
          <input type="date" value={expirationDate} onChange={(e)=>setExpirationDate(e.target.value)}/>
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
  } else {
  return (
  <div className={setofclasses}>
    <Card className={styles.customCard}>
      <Card.Body>
        <div className={styles.innerBodyContainer}>
          <Card.Img className={styles.cardImg} src={image}/>
          <div className={styles.cardTextContainer}>
            <Card.Text className={styles.cardText}>{name}</Card.Text>
          </div>
          <button className={styles.iconContainer+" "+styles.editButton} value="" onClick={(e)=>setEditMode(true)}> 
            <EditSVG />
          </button>
        </div>
      </Card.Body>

      <ListGroup variant="flush">
    
        <ListGroup.Item className={`${isNoQuantity ? Layout.noQuantity : ''} ${Layout.text} list-group-flush`}>
             Quantity: { quantity ? quantity : "NA"}
        </ListGroup.Item>

        <ListGroup.Item className={Layout.text+" "+"list-group-flush"}>
             Unit: { unit ? unit : "NA"}
        </ListGroup.Item>
         
        <ListGroup.Item className={`${isExpired ? Layout.expired : ''} ${Layout.text} list-group-flush`}>
              Expiration Date: { expirationDate ? expirationDate : "NA"}
         </ListGroup.Item>
      </ListGroup>

    </Card>
  </div>)
}
}