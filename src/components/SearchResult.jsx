import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link, useNavigate } from "react-router-dom";
import styles from '../css/ListItem.module.css'
import button from '../css/Buttons.module.css'


export default function SerarchResult({name, description, image, viewLink}) {
    const navigate = useNavigate()
    return (
        // <Container>
        <Row  className={styles.listItem}>
            {image ?
                <Col onClick={()=>navigate(viewLink)}>
                    <img src={image} alt="food" className={styles.image}/>
                </Col> 
                : <Col ></Col>}
            <Col  xs={10} className={styles.content} onClick={()=>navigate(viewLink)}>
                <h4 className={styles.title}> {name} </h4> 
            </Col>
        </Row>
        // {/* </Container> */}
    )
}
