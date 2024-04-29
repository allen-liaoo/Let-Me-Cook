import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from "react-router-dom";
import styles from '../css/ListItem.module.css'
import button from '../css/Buttons.module.css'


export default function ListItem({name, quantity, image, viewLink, editLink}) {
    const navigate = useNavigate()
    return (
        // <Container>
        <Row  className={styles.listItem}>
            {image ?
                <Col onClick={()=>navigate(viewLink)}>
                    <img src={image} alt="food" className={styles.image}/>
                </Col> 
                : <Col></Col>}
            <Col className={styles.content}>
                <Col onClick={()=>navigate(viewLink)} >
                    <h4 className={styles.title}> {name} </h4>
                    </Col>
                <Col onClick={()=>navigate(viewLink)} >
                    <p className={styles.quantity}> {quantity}</p></Col>
            </Col>
            <Col className={styles.editContaier}>
                <Link to={editLink} className={styles.editButton}>Edit</Link>
            </Col>
        </Row>
        // {/* </Container> */}
    )
}
