// import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styles from "../css/QueueItem.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Layout from "../css/ItemPageLayout.module.css";
import { ReactComponent as EditSVG }  from '../assets/edit.svg'
import { ReactComponent as DragSVG }  from '../assets/drag.svg'
import { ReactComponent as DeleteSVG }  from '../assets/delete.svg'
import QueueItemPopup from './QueueItemPopup';
import EmptyCard from './EmptyCard';

export default function QueueItem({ recipeId, deleteItem }) {
  const [loading, setLoading] = useState(true)
  const [recipe, setRecipe] = useState({}) // dont modify this past init
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      const recipeRes = await fetch(`/api/recipe/${recipeId}`, {
        method: "GET",
      })
      if (!recipeRes.ok) {
        console.log("Error getting recipe from recipe queue! ID: ", recipeId)
      }
      const recipeJson = await recipeRes.json();
      setRecipe(recipeJson.recipe)
      setLoading(false)
    })()
  }, [])

  if (loading || !recipe) return <EmptyCard feildnum="4"/>

  return (
  <div className={styles.wholeCard+' '+ Layout.centerrow}>
    <Card className={styles.customCard} style={{cursor: 'pointer'}} onClick={()=>setShowPopup(true)}>
      <Card.Body className={styles.cardBody}>
        <div className={styles.innerBodyContainer}>
          <Card.Img className={styles.cardImg} src={recipe.image}/>
          {/* TODO: Get the Card.Text overflow to look better or hide the overflow */}
          <div className={styles.cardTextContainer}>
            <Card.Text className={styles.cardText}>{recipe.name}</Card.Text>
            <Card.Text className={styles.cardText}>
              { recipe.instructions ? recipe.instructions.substring(25) 
                  + (recipe.instructions.length > 25 ? '...' : '') : ""}
            </Card.Text>
          </div>
          <div className={styles.iconContainer+ " " +styles.deleteButton} 
              onClick={(e) => {
                const res = window.confirm("Do you want to delete this recipe from the queue?")
                if (!res) return
                deleteItem()
                e.stopPropagation()
              }}><DeleteSVG /></div>
          <div className={styles.iconContainer+ " "+styles.editButton}
              onClick={(e) => {
                e.stopPropagation()
                navigate('/recipe/edit/'+recipe._id)
              }}><EditSVG /></div>
          <div className={styles.viewButton}>View</div>

          <div className={styles.iconContainer}><DragSVG /></div>
        </div>
      </Card.Body>
      { recipe.ingredients.length > 0 ?
          <ListGroup className="list-group-flush">
            { recipe.ingredients.map((ing, i) => 
              <ListGroup.Item key={i}>{ing.name}</ListGroup.Item>)
              .slice(0,3) }
            { recipe.ingredients.length > 4 ? 
              <ListGroup.Item key={recipe.length}>...</ListGroup.Item>
              : <></>
            }
          </ListGroup>
        : <></>
      }
    </Card>
    <QueueItemPopup 
        showPopup={showPopup}
        setShow={setShowPopup}
        recipe={recipe}
        /> 
  </div>)
}