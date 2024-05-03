import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Layout from "../css/ItemPageLayout.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as EditSVG }  from '../assets/edit.svg'

export default function RecipeItemBootstrap({ id, name, image, desciption, editLink, viewLink}){
  const navigate = useNavigate()
  return (
    <div className={styles.wholeCard +" "+Layout.centerrow}>
      <Card className={styles.customCard} style={{ width: '18rem', cursor: 'pointer' }}
            onClick={()=>navigate(editLink)}>
        <Card.Body>
          <div className={styles.innerBodyContainer}>
            <Card.Img className={styles.cardImg} src={image}/>

            <div className={styles.cardTextContainer}>
              <Card.Text className={styles.cardText}>{name}</Card.Text>
            </div>
            <Link to={editLink} className={styles.iconContainer+ " "+styles.editButton}> 
                <EditSVG />
            </Link>
            <Link  to={viewLink} className={styles.viewButton}> View </Link>
          </div>
        </Card.Body>
        {desciption?
        <ListGroup className={Layout.text+" "+"list-group-flush"}>
            <a href = {desciption}> {desciption}</a>
        </ListGroup>:<></>}
      </Card>
    </div>)
}