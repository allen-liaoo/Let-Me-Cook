import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { useState, useRef, useEffect } from 'react'
import Placeholder from 'react-bootstrap/Placeholder';

import Layout from "../css/ItemPageLayout.module.css";
export default function EmptyCard({ feildnum}){
    let temp= []
 for(let i = 0; i<feildnum; i++){
    temp.push(0)
 }
  return (
  <div className={styles.wholeCard+' '+ Layout.centerrow}>
    <Card className={styles.customCard}>
      <Card.Body className={styles.cardBody}>
        <div className={styles.innerBodyContainer}>
          <Card.Img  className={styles.cardImg} />
          {/* TODO: Get the Card.Text overflow to look better or hide the overflow */}
          <div className={styles.cardTextContainer}>
           
              <>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
            
                  <Placeholder xs={6} /> <Placeholder xs={8} />
                </Placeholder>
              </>
            
          </div>
          </div>
      </Card.Body>
      <ListGroup className="list-group-flush">
        {temp.map(tempitem => <ListGroup.Item>

            <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} /> 
                  </Placeholder>
        </ListGroup.Item>)}
      </ListGroup>
    </Card>
    </div>
)
}