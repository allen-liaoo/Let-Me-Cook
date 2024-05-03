import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from 'react'
import Placeholder from 'react-bootstrap/Placeholder';
import { ReactComponent as EditSVG }  from '../assets/edit.svg';
import { ReactComponent as DragSVG }  from '../assets/drag.svg';
import { ReactComponent as DeleteSVG }  from '../assets/delete.svg';

import Layout from "../css/ItemPageLayout.module.css";
export default function EmptyCard({ feildnum, isDraggable, isRecipe }){
    let temp= []
 for(let i = 0; i<feildnum; i++){
    temp.push(0)
 }
  return (
    <div className={styles.wholeCard+' '+ Layout.centerrow}>
      <Card className={styles.customCard}>
        <Card.Body className={styles.cardBody}>
          <div className={styles.innerBodyContainer}>
            <Card.Img className={styles.cardImg} src={'https://cdn3.iconfinder.com/data/icons/design-n-code/100/272127c4-8d19-4bd3-bd22-2b75ce94ccb4-512.png'}/>
            <div className={styles.cardTextContainer}>
              <Placeholder as={Card.Text} animation="glow">
                <Placeholder xs={4} /> <br/>
                {isRecipe || !isDraggable ? (<></>) : (<Placeholder xs={3} />)}
              </Placeholder>
            </div>
            <div className={styles.iconContainer+ " "+styles.editButton}><EditSVG /></div>
            {isDraggable ? (
              <>
                <div className={styles.iconContainer+ " "+styles.deleteButton}><DeleteSVG /></div> 
                <div className={styles.iconContainer}><DragSVG /></div>
              </>
            ) : (<></>)}
          </div>
        </Card.Body>
        {isRecipe ? (<></>) : (
          <ListGroup className="list-group-flush">
            {temp.map((tempitem,i) => <ListGroup.Item key={i}>

                <Placeholder as={Card.Text} animation="glow">
                      <Placeholder xs={3} /> 
                      </Placeholder>
            </ListGroup.Item>)}
          </ListGroup>
        )}
        
      </Card>
    </div>
  )
}