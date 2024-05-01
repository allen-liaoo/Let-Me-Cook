import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../css/QueueItem.module.css";
import Layout from "../css/ItemPageLayout.module.css";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';


export default function SerarchResult({ name, image, handleNameChange, handleImageChange, url }){
  
    
        return (
            <div className={styles.wholeCard +" "+Layout.centerrow}>
              <Card className={styles.customCard} style={{ width: '18rem' }}>
                <Card.Body>
                  <div className={styles.innerBodyContainer}>
                    <Card.Img onChange={handleImageChange} className={styles.cardImg} src={image}/>

                    <div className={styles.cardTextContainer}>
                      <Card.Text onChange={handleNameChange} className={styles.cardText}>{name}</Card.Text>
                    </div>
                    <button className={styles.iconContainer+ " "+styles.addButton}> 
                      +
                    </button>
                  </div>
                </Card.Body>
                {url?
                <ListGroup className={Layout.text+" "+"list-group-flush"}>
                    <a href = {url}> {url}</a>
                </ListGroup>:<></>}
              </Card>
            </div>)
    
  
}